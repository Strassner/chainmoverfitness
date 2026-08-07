/**
 * Chainmover — Application notifier
 * ---------------------------------------------------------------------------
 * A standalone Apps Script project, separate from the metabolic-health quiz
 * script. It does exactly two things when someone submits /apply:
 *
 *   1. appends the application to a Google Sheet
 *   2. posts an instant Slack notification with their name and phone number
 *
 * It does NOT look at Calendly or track whether anyone booked. That is
 * deliberate — bookings are reviewed manually.
 *
 * SETUP — do these in order:
 *
 *   1. Create a new Google Sheet. Copy its ID from the URL:
 *      docs.google.com/spreadsheets/d/<THIS_PART>/edit
 *
 *   2. Create a Slack incoming webhook:
 *      api.slack.com/apps -> Create New App -> From scratch -> pick your
 *      workspace -> Incoming Webhooks -> toggle On -> Add New Webhook to
 *      Workspace -> choose the channel -> copy the https://hooks.slack.com/...
 *      URL.
 *
 *   3. script.google.com -> New project. Paste this file in as Code.gs.
 *
 *   4. Project Settings -> Script Properties -> add two properties:
 *        SLACK_WEBHOOK_URL   the webhook URL from step 2
 *        SHEET_ID            the sheet ID from step 1
 *      Storing them here keeps secrets out of source control.
 *
 *   5. Run `setupCheck` once from the editor. Approve the permission prompt.
 *      It verifies both properties, writes the header row, and posts a test
 *      message to Slack so you know the wiring works before any real lead.
 *
 *   6. Deploy -> New deployment -> type "Web app".
 *        Execute as:       Me
 *        Who has access:   Anyone
 *      "Anyone" is required — the browser calls this without a Google login.
 *      Copy the /exec URL.
 *
 *   7. Paste that /exec URL into APPLICATION_SCRIPT_URL at the top of
 *      src/ApplicationPage.jsx.
 *
 * NOTE: after any edit to this file you must re-deploy (Deploy -> Manage
 * deployments -> edit -> Version: New version). Saving alone does nothing to
 * the live /exec URL.
 */

var SHEET_NAME = 'Applications';

var HEADERS = [
  'Timestamp',
  'Name',
  'Phone',
  'Email',
  'Source',
  'Weight to lose',
  'Situation',
  'Can invest',
  'Start timeline',
  'Instagram',
  'Quiz bucket',
];

/* ── entry points ───────────────────────────────────────────────────────── */

function doGet(e) {
  return handle_((e && e.parameter) || {});
}

function doPost(e) {
  var params = (e && e.parameter) || {};
  // Also accept a JSON body, in case anything posts that way later.
  if (e && e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      for (var k in body) if (!(k in params)) params[k] = body[k];
    } catch (err) { /* not JSON — form params only */ }
  }
  return handle_(params);
}

/**
 * The browser sends this with `mode: 'no-cors'`, so it never reads the
 * response. The return value is only for manual testing in a browser tab.
 */
function handle_(p) {
  var result = { ok: true, logged: false, notified: false };

  // Log first, notify second. If Slack is down we still keep the lead.
  try {
    appendRow_(p);
    result.logged = true;
  } catch (err) {
    result.ok = false;
    result.logError = String(err);
  }

  try {
    notifySlack_(p);
    result.notified = true;
  } catch (err) {
    result.ok = false;
    result.slackError = String(err);
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ── sheet ──────────────────────────────────────────────────────────────── */

function sheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Script property SHEET_ID is not set.');

  var ss = SpreadsheetApp.openById(id);
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function appendRow_(p) {
  // Leading apostrophe keeps Sheets from mangling a phone number into a
  // number or a date.
  var phone = p.phone ? "'" + p.phone : '';

  sheet_().appendRow([
    p.timestamp || new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    p.name || '',
    phone,
    p.email || '',
    p.source || 'direct',
    p.weight_to_lose || '',
    p.situation || '',
    p.can_invest || '',
    p.start_timeline || '',
    p.instagram || '',
    p.bucket || '',
  ]);
}

/* ── slack ──────────────────────────────────────────────────────────────── */

/** Digits only, so Slack renders a tappable tel: link on mobile. */
function telLink_(phone) {
  if (!phone) return '_not given_';
  var digits = String(phone).replace(/[^0-9+]/g, '');
  if (!digits) return phone;
  if (digits.charAt(0) !== '+' && digits.length === 10) digits = '+1' + digits;
  return '<tel:' + digits + '|' + phone + '>';
}

function notifySlack_(p) {
  var url = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
  if (!url) throw new Error('Script property SLACK_WEBHOOK_URL is not set.');

  var name = p.name || 'Name not given';
  var readyNow = (p.start_timeline || '').toLowerCase().indexOf('ready now') === 0;

  var blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: (readyNow ? '🔥 ' : '🚨 ') + 'New application: ' + name, emoji: true },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: '*Phone*\n' + telLink_(p.phone) },
        { type: 'mrkdwn', text: '*Email*\n' + (p.email || '_not given_') },
        { type: 'mrkdwn', text: '*Wants to lose*\n' + (p.weight_to_lose || '—') },
        { type: 'mrkdwn', text: '*Ready to start*\n' + (p.start_timeline || '—') },
        { type: 'mrkdwn', text: '*Can invest*\n' + (p.can_invest || '—') },
        { type: 'mrkdwn', text: '*Came from*\n' + (p.source || 'direct') },
      ],
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: '*Where they are at*\n' + (p.situation || '—') },
    },
    {
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: 'Applied ' + (p.timestamp || new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })) +
              ' · check the calendar, and if they have not booked, call them.',
      }],
    },
  ];

  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      text: 'New application: ' + name + ' · ' + (p.phone || 'no phone'), // notification preview
      blocks: blocks,
    }),
    muteHttpExceptions: true,
  });

  var code = res.getResponseCode();
  if (code !== 200) throw new Error('Slack returned ' + code + ': ' + res.getContentText());
}

/* ── setup / test ───────────────────────────────────────────────────────── */

/**
 * Run this once from the editor after setting the script properties.
 * Verifies both properties, creates the header row, and posts a test message.
 */
function setupCheck() {
  var props = PropertiesService.getScriptProperties();
  var missing = ['SHEET_ID', 'SLACK_WEBHOOK_URL'].filter(function (k) { return !props.getProperty(k); });
  if (missing.length) throw new Error('Missing script propert(ies): ' + missing.join(', '));

  sheet_(); // creates the tab and headers if needed
  notifySlack_({
    name: 'Test Applicant',
    phone: '5551234567',
    email: 'test@example.com',
    source: 'setup-check',
    weight_to_lose: '60–100 lbs',
    situation: "I've tried diets before and nothing's worked",
    can_invest: 'Yes',
    start_timeline: 'Ready now',
  });

  Logger.log('OK — sheet reachable and Slack message sent. Nothing was written to the sheet.');
}

/** End-to-end test: writes a real row AND posts to Slack. Delete the row after. */
function testFullSubmission() {
  Logger.log(handle_({
    name: 'Test Applicant',
    phone: '5551234567',
    email: 'test@example.com',
    source: 'metabolic',
    weight_to_lose: '100+ lbs',
    situation: "I've failed so many times I can't trust myself to commit",
    can_invest: 'Yes',
    start_timeline: 'Ready now',
  }).getContent());
}
