/**
 * ════════════════════════════════════════════════════════════════════
 *  FLUENCY LAB  →  GOOGLE CLASSROOM INSTALLER
 *  Mr. Allen's Math Class
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT THIS DOES
 *  Creates a "Fluency Lab" topic in your Google Classroom and posts all
 *  nine items for you (a Start Here card plus the eight skill modules,
 *  each with its Practice and Skill Check links).
 *
 *  HOW TO RUN IT  — four steps, about two minutes
 *    1. At the top of this editor, click  Services  +   then pick
 *       "Google Classroom API" and click  Add.
 *    2. Press  Run  (the ▷ button).
 *    3. Google will ask you to allow it. Choose your school account →
 *       Advanced → "Go to ... (unsafe)" → Allow.  (It says "unsafe"
 *       because the script is yours and not published by a company.
 *       It only touches your own Classroom.)
 *    4. Read the log at the bottom. Done.
 *
 *  IF YOU TEACH MORE THAN ONE CLASS
 *  The first run lists your classes and stops without changing anything.
 *  Copy the class name into COURSE_NAME below and press Run again.
 *
 *  SAFE TO RUN TWICE
 *  It skips anything already posted, so re-running only adds what's
 *  missing. Nothing is ever deleted or overwritten.
 * ════════════════════════════════════════════════════════════════════
 */

// ─── SETTINGS — the only lines you might need to touch ───────────────

/** Leave blank to auto-pick when you have one active class. */
var COURSE_NAME = '';

/** 'PUBLISHED' posts to students now. Use 'DRAFT' to stage it quietly. */
var POST_STATE = 'PUBLISHED';

/** true also creates a graded Assignment for each Skill Check. */
var ALSO_CREATE_QUIZ_ASSIGNMENTS = false;

/** Points for those assignments (only used if the flag above is true). */
var QUIZ_POINTS = 12;

// ─── CONTENT (already filled in — no need to edit) ───────────────────

var BASE = 'https://zacharyallen-netizen.github.io/Mr-Allen-s-Math-Class/'
         + 'grade8/Fluency-Lab-Package/fluency-lab/';

var TOPIC_NAME = 'Fluency Lab';

var MODULES = [
  { tier: 'Whole-Number Fluency', name: 'Add & Subtract',
    practice: 'fluency-lab-add-subtract.html', quiz: 'quiz-add-subtract.html' },
  { tier: 'Whole-Number Fluency', name: 'Multiply',
    practice: 'fluency-lab-multiply.html',     quiz: 'quiz-multiply.html' },
  { tier: 'Whole-Number Fluency', name: 'Divide',
    practice: 'fluency-lab-divide.html',       quiz: 'quiz-divide.html' },
  { tier: 'Rational Numbers',     name: 'Fractions',
    practice: 'fluency-lab-fractions.html',    quiz: 'quiz-fractions.html' },
  { tier: 'Rational Numbers',     name: 'Decimals & Percents',
    practice: 'fluency-lab-decimals.html',     quiz: 'quiz-decimals.html' },
  { tier: 'Rational Numbers',     name: 'Integers',
    practice: 'fluency-lab-integers.html',     quiz: 'quiz-integers.html' },
  { tier: 'Toward Grade Level',   name: 'Ratios & Proportions',
    practice: 'fluency-lab-ratios.html',       quiz: 'quiz-ratios.html' },
  { tier: 'Toward Grade Level',   name: 'Expressions & Order of Operations',
    practice: 'fluency-lab-expressions.html',  quiz: 'quiz-expressions.html' }
];

// ════════════════════════════════════════════════════════════════════
//  MAIN — this is the function to Run
// ════════════════════════════════════════════════════════════════════
function run() {
  var log = [];
  function say(s) { log.push(s); Logger.log(s); }

  say('Fluency Lab → Google Classroom');
  say('─────────────────────────────────────────────');

  // 1. find the class ------------------------------------------------
  var course;
  try {
    course = pickCourse(say);
  } catch (e) {
    say('STOPPED: ' + e.message);
    return finish(log);
  }
  if (!course) return finish(log);
  say('Class: ' + course.name + '   (id ' + course.id + ')');

  // 2. topic ---------------------------------------------------------
  var topicId = ensureTopic(course.id, TOPIC_NAME, say);

  // 3. what is already posted ---------------------------------------
  var existing = {};
  try {
    var res = Classroom.Courses.CourseWorkMaterials.list(course.id, { pageSize: 200 });
    var list = res.courseWorkMaterial || res.courseWorkMaterials || [];
    for (var i = 0; i < list.length; i++) existing[norm(list[i].title)] = true;
  } catch (e) { /* none yet — fine */ }

  // 4. Start Here ----------------------------------------------------
  var added = 0, skipped = 0;
  var startTitle = 'Fluency Lab — Start Here';
  if (existing[norm(startTitle)]) {
    say('• already there: ' + startTitle); skipped++;
  } else {
    createMaterial(course.id, topicId, startTitle,
      'Open the Lab, pick your assigned skill, finish the Practice, then take the '
      + 'Skill Check and submit your score.\n\n'
      + 'Practice first — the Skill Check is 12 questions and grades itself.',
      [BASE + 'index.html'], say);
    added++;
  }

  // 5. the eight modules --------------------------------------------
  for (var m = 0; m < MODULES.length; m++) {
    var mod = MODULES[m];
    var title = 'Fluency Lab ' + (m + 1) + ' — ' + mod.name;
    if (existing[norm(title)]) { say('• already there: ' + title); skipped++; continue; }
    createMaterial(course.id, topicId, title,
      mod.tier + '\n\n'
      + 'STEP 1 — Practice: work through it one step at a time. A wrong entry '
      + 'will not let you move on, so you have to do the maths.\n'
      + 'STEP 2 — Skill Check: 12 questions, grades itself. Screenshot your '
      + 'score and turn it in.',
      [BASE + mod.practice, BASE + mod.quiz], say);
    added++;
  }

  // 6. optional graded assignments ----------------------------------
  if (ALSO_CREATE_QUIZ_ASSIGNMENTS) {
    for (var q = 0; q < MODULES.length; q++) {
      var md = MODULES[q];
      var at = 'Skill Check — ' + md.name;
      try {
        Classroom.Courses.CourseWork.create({
          title: at,
          description: 'Take the Skill Check, then attach a screenshot of your final score.',
          materials: [{ link: { url: BASE + md.quiz } }],
          workType: 'ASSIGNMENT',
          state: POST_STATE,
          maxPoints: QUIZ_POINTS,
          topicId: topicId
        }, course.id);
        say('✓ assignment: ' + at); added++;
      } catch (e) { say('✗ assignment failed (' + at + '): ' + e.message); }
    }
  }

  say('─────────────────────────────────────────────');
  say('Added ' + added + ', already present ' + skipped + '.');
  say('Open Classroom → Classwork → "' + TOPIC_NAME + '" to see them.');
  return finish(log);
}

// ════════════════════════════════════════════════════════════════════
//  helpers
// ════════════════════════════════════════════════════════════════════
function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim().toLowerCase(); }

function pickCourse(say) {
  var res = Classroom.Courses.list({ courseStates: ['ACTIVE'], teacherId: 'me', pageSize: 100 });
  var courses = res.courses || [];
  if (!courses.length) {
    throw new Error('No active classes found on this Google account. '
      + 'Make sure you signed in with your school account.');
  }
  if (COURSE_NAME) {
    var want = norm(COURSE_NAME), hit = null;
    for (var i = 0; i < courses.length; i++) {
      var n = norm(courses[i].name);
      if (n === want || n.indexOf(want) !== -1) { hit = courses[i]; break; }
    }
    if (!hit) {
      say('Could not find a class matching "' + COURSE_NAME + '". Your classes:');
      for (var j = 0; j < courses.length; j++) say('   • ' + courses[j].name);
      say('Copy one of those names into COURSE_NAME at the top, then Run again.');
      return null;
    }
    return hit;
  }
  if (courses.length === 1) return courses[0];
  say('You teach more than one class, so nothing was changed yet.');
  say('Your classes:');
  for (var k = 0; k < courses.length; k++) say('   • ' + courses[k].name);
  say('');
  say('Copy the one you want into COURSE_NAME at the top of the script,');
  say('then press Run again.');
  return null;
}

function ensureTopic(courseId, name, say) {
  try {
    var res = Classroom.Courses.Topics.list(courseId, { pageSize: 100 });
    var topics = res.topic || res.topics || [];
    for (var i = 0; i < topics.length; i++) {
      if (norm(topics[i].name) === norm(name)) {
        say('Topic "' + name + '" already exists — reusing it.');
        return topics[i].topicId;
      }
    }
  } catch (e) { /* fall through and create */ }
  var t = Classroom.Courses.Topics.create({ name: name }, courseId);
  say('Created topic "' + name + '".');
  return t.topicId;
}

function createMaterial(courseId, topicId, title, description, urls, say) {
  var materials = [];
  for (var i = 0; i < urls.length; i++) materials.push({ link: { url: urls[i] } });
  var body = {
    title: title,
    description: description,
    materials: materials,
    state: POST_STATE
  };
  if (topicId) body.topicId = topicId;
  try {
    Classroom.Courses.CourseWorkMaterials.create(body, courseId);
    say('✓ posted: ' + title);
  } catch (e) {
    say('✗ FAILED: ' + title + '  →  ' + e.message);
  }
}

function finish(log) {
  var text = log.join('\n');
  try {
    // also show a popup if this was run from a Sheet/Doc; harmless otherwise
    SpreadsheetApp.getUi().alert(text);
  } catch (e) { /* standalone script — the log is enough */ }
  return text;
}

/**
 * OPTIONAL — run this one on its own to check every Fluency Lab link is
 * live before you post anything to students.
 */
function checkLinks() {
  var urls = [BASE + 'index.html'];
  for (var i = 0; i < MODULES.length; i++) {
    urls.push(BASE + MODULES[i].practice);
    urls.push(BASE + MODULES[i].quiz);
  }
  var bad = 0;
  for (var u = 0; u < urls.length; u++) {
    var code;
    try {
      code = UrlFetchApp.fetch(urls[u], { muteHttpExceptions: true, followRedirects: true })
                        .getResponseCode();
    } catch (e) { code = 'ERROR'; }
    if (code !== 200) { bad++; Logger.log('✗ ' + code + '  ' + urls[u]); }
  }
  Logger.log(bad === 0
    ? '✓ All ' + urls.length + ' Fluency Lab links are live.'
    : bad + ' of ' + urls.length + ' links did not return 200 — see above.');
}
