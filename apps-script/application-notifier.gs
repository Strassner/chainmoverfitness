/**
 * Chainmover Coaching — Application notifier
 * ---------------------------------------------------------------------------
 * A standalone Apps Script project, separate from the metabolic-health quiz
 * script. It does exactly three things when someone submits /apply:
 *
 *   1. appends the application to a Google Sheet
 *   2. posts an instant Slack notification with their name and phone number
 *   3. adds them to the systeme.io email list, tagged
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
 *   4. Create a systeme.io API key: profile picture -> Settings -> Public API
 *      keys -> Create. Copy the token immediately, it is shown once.
 *
 *   5. Project Settings -> Script Properties -> add three properties:
 *        SLACK_WEBHOOK_URL   the webhook URL from step 2
 *        SHEET_ID            the sheet ID from step 1
 *        SYSTEME_API_KEY     the token from step 4
 *      Storing them here keeps secrets out of source control. The key must
 *      never go in src/ — that bundle is public, anyone can read it.
 *
 *   6. Run `setupCheck` once from the editor. Approve the permission prompt.
 *      It verifies the properties, writes the header row, and posts a test
 *      message to Slack so you know the wiring works before any real lead.
 *      Then run `testSysteme` to confirm the email list side.
 *
 *   7. Deploy -> New deployment -> type "Web app".
 *        Execute as:       Me
 *        Who has access:   Anyone
 *      "Anyone" is required — the browser calls this without a Google login.
 *      Copy the /exec URL.
 *
 *   8. Paste that /exec URL into APPLICATION_SCRIPT_URL at the top of
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
  'Came from page',
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
  var result = { ok: true, logged: false, notified: false, synced: false };

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

  // Email list last. It is the only one of the three you can repair by hand
  // later from the sheet, so it is the safest thing to fail.
  try {
    syncSysteme_(p);
    result.synced = true;
  } catch (err) {
    result.ok = false;
    result.systemeError = String(err);
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
    p.page_src || '',
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
        { type: 'mrkdwn', text: '*Came from*\n' + (p.source || 'direct') + (p.page_src ? ' · ' + p.page_src : '') },
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

/* ── systeme.io ─────────────────────────────────────────────────────────── */

var SYSTEME_API = 'https://api.systeme.io/api';

/** Every call goes through here so the key is read in exactly one place. */
function systemeFetch_(path, method, payload) {
  var key = PropertiesService.getScriptProperties().getProperty('SYSTEME_API_KEY');
  if (!key) throw new Error('Script property SYSTEME_API_KEY is not set.');

  var opts = {
    method: method,
    headers: { 'X-API-Key': key },
    contentType: 'application/json',
    muteHttpExceptions: true, // we inspect the code ourselves
  };
  if (payload) opts.payload = JSON.stringify(payload);

  var res = UrlFetchApp.fetch(SYSTEME_API + path, opts);
  return { code: res.getResponseCode(), body: res.getContentText() };
}

function systemeJson_(body) {
  try { return JSON.parse(body); } catch (err) { return null; }
}

/** List endpoints have changed shape before — accept every form of them. */
function systemeItems_(body) {
  var j = systemeJson_(body);
  if (!j) return [];
  if (j instanceof Array) return j;
  return j.items || j['hydra:member'] || [];
}

/**
 * Which tags this submission earns. Edit this function to change the taxonomy —
 * tags are created in systeme.io automatically the first time they are used.
 */
function systemeTags_(p) {
  var tags = ['source-website'];
  if ((p.form || '').indexOf('application') === 0) tags.push('applied');
  if (p.bucket) {
    tags.push('bucket-' + String(p.bucket).toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  }
  return tags;
}

/** Name -> tag id, creating the tag if it does not exist yet. Cached 6h. */
function systemeTagId_(name) {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('systeme_tag_' + name);
  if (cached) return Number(cached);

  var id = null;
  var list = systemeItems_(systemeFetch_('/tags', 'get').body);
  for (var i = 0; i < list.length; i++) {
    if (list[i].name === name) { id = list[i].id; break; }
  }

  if (!id) {
    var made = systemeFetch_('/tags', 'post', { name: name });
    if (made.code >= 300) throw new Error('create tag ' + made.code + ': ' + made.body);
    var j = systemeJson_(made.body);
    id = j && j.id;
  }

  if (id) cache.put('systeme_tag_' + name, String(id), 21600);
  return id;
}

/**
 * Contact id for this email, creating them if they are new. systeme.io treats
 * email as unique, so a repeat submission returns the existing contact rather
 * than duplicating them.
 */
function systemeContactId_(email, name) {
  var payload = { email: email };
  var first = String(name || '').trim().split(/\s+/)[0];
  if (first) payload.fields = [{ slug: 'first_name', value: first }];

  var res = systemeFetch_('/contacts', 'post', payload);

  // Never lose a contact over a first name — retry bare if the fields array
  // is rejected.
  if (res.code >= 300 && payload.fields) {
    res = systemeFetch_('/contacts', 'post', { email: email });
  }

  var created = systemeJson_(res.body);
  if (res.code < 300 && created && created.id) return created.id;

  // Already on the list. Look them up so we can still apply the new tags.
  var found = systemeItems_(systemeFetch_('/contacts?email=' + encodeURIComponent(email), 'get').body);
  if (found.length && found[0].id) return found[0].id;

  throw new Error('systeme.io ' + res.code + ': ' + res.body);
}

/**
 * Adds the applicant to the email list. Called last in handle_ so that a
 * systeme.io outage can never cost you the lead itself.
 */
function syncSysteme_(p) {
  var email = String(p.email || '').trim();
  if (!email) return; // nothing to sync — not an error

  var id = systemeContactId_(email, p.name);

  // Tagging is best effort. They are already on the list, which is the part
  // that matters; a missing tag is a nuisance, a lost subscriber is not.
  systemeTags_(p).forEach(function (tag) {
    try {
      var res = systemeFetch_('/contacts/' + id + '/tags', 'post', { tagId: systemeTagId_(tag) });
      if (res.code >= 300) throw new Error(res.code + ': ' + res.body);
    } catch (err) {
      Logger.log('systeme.io tag "' + tag + '" failed: ' + err);
    }
  });
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

  if (!props.getProperty('SYSTEME_API_KEY')) {
    Logger.log('WARNING: SYSTEME_API_KEY is not set — leads will be logged and ' +
               'sent to Slack, but not added to the email list.');
  }

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

/**
 * systeme.io only — touches nothing else. Change TEST_EMAIL to your own address
 * with a +tag so you can find and delete the contact afterwards, then run this
 * and read the execution log.
 */
function testSysteme() {
  var TEST_EMAIL = 'luke.strassner.fit+systemetest@gmail.com';

  syncSysteme_({
    email: TEST_EMAIL,
    name: 'Test Applicant',
    form: 'application',
    bucket: 'high',
  });

  Logger.log('Done. Check systeme.io -> Contacts for ' + TEST_EMAIL +
             ' and confirm the tags source-website, applied, bucket-high. ' +
             'Any tag error is logged above this line.');
}

/**
 * End-to-end test: writes a real row, posts to Slack, AND creates the contact
 * in systeme.io. Afterwards delete both the sheet row and the test@example.com
 * contact.
 */
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
