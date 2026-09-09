/* THIS IS THE FILE YOU EDIT.
   ---------------------------------------------------------------------------
   Every real-world fact about the cup lives here, and nowhere else. Change a
   value here and every page that mentions it changes with it, in both languages.

   Everything ships as null or an empty list on purpose. The site is written to
   be honest about a missing value: an unset price does not render "KWD" with a
   gap in front of it, it renders a sentence saying the price is not published
   yet. Fill the value in and that sentence is replaced by the fact.

   The rule the renderer follows, so you can predict it:
     null / "" / []      the section shows its honest "not published yet" copy
     a value             the section shows the value
     a half-filled list  only the filled rows show, and the page says how many
                         are published rather than implying that is all of them

   Nothing here is allowed to be a guess. If you do not know it, leave it null. */

window.CUP_CONTENT = {

  /* The price in Kuwaiti dinar, as a number: 11.5 — not the string "11.500 KWD".
     You are pricing inside the 8.5-13 band but have not picked the figure, so
     this stays null. The reservation works either way, because reserving costs
     nothing. */
  price: null,

  product: {
    capacityMl: null,
    /* The same capacity in terms a person actually orders in. */
    capacityInRealTerms: { en: null, ar: null },

    /* Publish these only once measured, and publish the conditions with them. */
    hoursCold: null,
    hoursHot: null,

    steelGrade: null,
    weightG: null,

    /* These two come off your own 3D model sheet, so they are filled in. They
       are also what the 3D cup on the site is proportioned from — change them
       and the model changes shape. */
    heightCm: 22,
    diameterCm: 7,

    /* The band around the collection cups. Set to false for a plain cup. */
    saduBand: true,

    /* The palette, named for things here rather than for a paint chart.
       `slug` is what gets stored on an order, so never change a slug once you
       have taken a reservation against it — change the labels instead.
       Delete the ones you are not making. `hex` only draws the swatch. */
    /* THE KUWAIT COLLECTION — the Sadu-inspired palette.
       Every one of these drives the 3D cup on the page: pick a colour and the
       model repaints. Delete the ones you are not making and they disappear
       from the site, the engraving preview and the reservation form at once. */
    colours: [
      { slug: 'navy',           hex: '#2A3A52', en: 'Navy',           ar: 'كحلي' },
      { slug: 'cream',          hex: '#EFE6D6', en: 'Cream',          ar: 'كريمي' },
      { slug: 'beige-sand',     hex: '#D8C9AE', en: 'Beige Sand',     ar: 'رملي فاتح' },
      { slug: 'sand-brown',     hex: '#7B6350', en: 'Sand Brown',     ar: 'بني رملي' },
      { slug: 'terracotta',     hex: '#B0603A', en: 'Terracotta',     ar: 'طيني' },
      { slug: 'sadu-burgundy',  hex: '#6B2028', en: 'Sadu Burgundy',  ar: 'عنّابي السدو' },
      { slug: 'rosewood',       hex: '#9C6A6B', en: 'Rosewood',       ar: 'خشب الورد' },
      { slug: 'dusty-pink',     hex: '#DFC0BB', en: 'Dusty Pink',     ar: 'وردي هادي' },
      { slug: 'mustard',        hex: '#D5A02E', en: 'Mustard',        ar: 'خردلي' },
      { slug: 'olive-khaki',    hex: '#5C6544', en: 'Olive Khaki',    ar: 'زيتي' },
      { slug: 'sage',           hex: '#A9B69C', en: 'Sage',           ar: 'مريمية' },
      { slug: 'slate-blue',     hex: '#90A9C2', en: 'Slate Blue',     ar: 'أزرق حجري' },
      { slug: 'charcoal',       hex: '#3B3A3A', en: 'Charcoal',       ar: 'فحمي' },
      { slug: 'matte-black',    hex: '#1B1B1D', en: 'Matte Black',    ar: 'أسود مطفي' }
    ],

    /* What it is NOT good for. This one ships filled in, because these are true
       of every vacuum-walled steel cup and are not claims about ours in
       particular. Saying it first reduces returns and reads as confidence. */
    notGoodFor: [
      { en: 'The dishwasher. Heat and detergent shorten the life of the seal.',
        ar: 'الجلاية. الحرارة والمنظف يقصّرون عمر الحشوة.' },
      { en: 'Fizzy drinks. A sealed lid plus a carbonated drink is a pressure problem.',
        ar: 'المشروبات الغازية. غطا محكم مع مشروب غازي يعني ضغط داخل الكوب.' },
      { en: 'Hot drinks through a straw lid. A straw puts boiling liquid straight at the back of your mouth.',
        ar: 'المشروبات الحارة مع غطا المصاصة. المصاصة توصل السائل الحار مباشرة لآخر الحلق.' }
    ]
  },

  /* THE KUWAIT HEAT TEST.
     One row per hourly reading. The page draws the table and states plainly
     which hour performance falls away — including the hour it fails. Publishing
     the failure is the reason anyone believes the rest of it.
     Leave the array empty until the test has actually been run.
       { at: '07:00', ambientC: 41, contentsC: 3, note: 'Filled with ice, windows up' } */
  heatTest: {
    rows: [],
    conditions: { en: null, ar: null },
    date: null
  },

  /* CUP-HOLDER FIT.
     One entry per car you have PHYSICALLY TESTED. Never a spec-sheet guess.
     fits: true | false | 'tight'
       { make: 'Toyota', model: 'Land Cruiser', years: '2016-2021', fits: true, note: '' } */
  fit: {
    entries: [],
    baseDiameterMm: null
  },

  /* Engraving limits. Real constraints of the machine and the script, so these
     ship filled in. Change them if your engraver differs. Set `available` to
     false the day you stop taking engraving and the promise degrades honestly
     instead of breaking. */
  engraving: {
    maxLatin: 16,
    maxArabic: 12,
    available: true
  },

  /* Replacement parts, sold separately, because a cup meant to last needs them.
       { slug: 'lid', en: 'Sealing lid', ar: 'غطا محكم', priceKwd: null } */
  parts: [],

  warranty: { en: null, ar: null },

  /* Delivery, in hours rather than days. cutoff is a plain string like '18:00'.
       { en: 'Hawalli', ar: 'حولي', hours: 24 } */
  delivery: { areas: [], cutoff: null },

  /* HOW PEOPLE REACH YOU.
     Nothing here is invented, so nothing here is filled in. Put your real
     handles in and they appear in the footer. Leave one null and it is simply
     not shown — no dead link, no empty icon.
       instagram  the handle without the @, e.g. 'cup.kw'
       whatsapp   full international number, digits only, e.g. '9651234567'
       email      an address on a domain you actually control */
  contact: { instagram: null, whatsapp: null, email: null }
};


/* --------------------------------------------------------------------------
   THE WORDS.
   The Arabic is not a translation of the English. Several lines say something
   different in Arabic in order to mean the same thing to a Kuwaiti reader.
   Copy translated word-for-word reads as foreign, and foreign reads as untrusted.
   -------------------------------------------------------------------------- */

window.CUP_STRINGS = {

  'nav.home':     { en: 'Home',      ar: 'الرئيسية' },
  'nav.engrave':  { en: 'Engraving', ar: 'الحفر' },
  'nav.reserve':  { en: 'Your cup',  ar: 'كوبك' },
  'nav.login':    { en: 'Sign in',   ar: 'دخول' },
  'nav.skip':     { en: 'Skip to content', ar: 'تخطَّ إلى المحتوى' },

  'switch.lang':       { en: 'العربية', ar: 'English' },
  'switch.lang.aria':  { en: 'Switch to Arabic', ar: 'التبديل إلى الإنجليزية' },
  'switch.motion.on':  { en: 'Motion on',  ar: 'الحركة شغالة' },
  'switch.motion.off': { en: 'Motion off', ar: 'الحركة مطفية' },
  'switch.motion.aria':{ en: 'Turn animation on or off', ar: 'تشغيل أو إطفاء الحركة' },

  /* ---- home ---- */

  'home.title': { en: 'cup.kw — one cup, with your name on it',
                  ar: 'cup.kw — كوب واحد، وعليه اسمك' },
  'home.meta':  { en: 'An insulated stainless steel cup, made for Kuwait, engraved with your name. One cup, one link.',
                  ar: 'كوب ستيل معزول، مصنوع للكويت، محفور عليه اسمك. كوب واحد، ورابط واحد.' },

  'home.eyebrow': { en: 'One cup, one link', ar: 'كوب واحد، ورابط واحد' },
  'home.h1':      { en: 'Yours, not everyone’s.', ar: 'كوبك انت، مو كوب الكل.' },
  'home.lede':    { en: 'A double-walled steel cup with your name cut into it. The same cup everyone gets. Not the same cup.',
                  ar: 'كوب ستيل بجدارين، واسمك محفور عليه. نفس الكوب اللي عند الكل، وبنفس الوقت مو نفسه.' },
  'home.cta':     { en: 'Engrave yours',  ar: 'احفر كوبك' },
  'home.cta2':    { en: 'See the proof',  ar: 'شوف الإثبات' },

  'home.why.h': { en: 'A colour is not yours. A name is.', ar: 'اللون ما يصير لك. الاسم يصير.' },
  'home.why.p': { en: 'Anyone can buy the same colour as you. That is what a colour is for.\nAn engraving is the one thing about a cup that cannot be bought twice. It is also the reason a cup comes home, instead of getting left on a desk, in a car, at a diwaniya.',
                  ar: 'أي أحد يقدر ياخذ نفس لونك، هذي وظيفة اللون أصلاً.\nالحفر هو الشي الوحيد بالكوب اللي ما ينشرى مرتين. وهو نفسه السبب اللي يخلي الكوب يرجع البيت، بدال ما ينسى على مكتب، ولا بسيارة، ولا بديوانية.' },

  'home.claims.h': { en: 'What that gets you', ar: 'شنو تستفيد' },
  'home.claim1': { en: 'No leaks in the tote.',                     ar: 'ما يسرّب بالشنطة.' },
  'home.claim2': { en: 'No sweat ring on the desk.',                ar: 'ما يعرّق ويخلي دايرة على المكتب.' },
  'home.claim3': { en: 'No lid that smells like yesterday’s coffee.', ar: 'وغطا ما يريّح قهوة أمس.' },
  'home.claim4': { en: 'No arguing over whose cup this is.',        ar: 'وما في نقاش منو صاحب الكوب.' },

  'home.steel.h': { en: 'Steel does not remember.', ar: 'الستيل ما يحتفظ بالريحة.' },
  'home.steel.p': { en: 'The wall your drink touches is stainless steel. It does not hold on to what you drank yesterday, and it does not soften the way plastic does when something hot goes into it every day.\nBetween the two walls there is a vacuum. Nothing in there to carry heat in, nothing to carry cold out. That is not a claim about our cup — that is what a vacuum wall is.',
                  ar: 'الجدار اللي يلمس شرابك ستيل. ما يمسك ريحة اللي شربته أمس، وما يلين مثل البلاستيك لما تحط فيه شي حار كل يوم.\nوبين الجدارين فراغ. ما في شي ينقل الحرارة داخل، ولا شي يطلّع البرودة برا. هذا مو ادعاء على كوبنا، هذي طبيعة الجدار المفرّغ.' },

  'home.proof.h': { en: 'The Kuwait Heat Test', ar: 'اختبار حر الكويت' },
  'home.proof.p': { en: 'Ice in the cup at seven in the morning. Cup in a car in Shuwaikh, windows up. A reading every hour until it fails.\nWe publish the hour it fails, too. A test you only half publish is an advert.',
                  ar: 'ثلج بالكوب الساعة سبع الصبح. والكوب بسيارة بالشويخ والدريشة مسكرة. وقراءة كل ساعة لين ما يخون.\nوبنكتب الساعة اللي خان فيها بعد. الاختبار اللي ينشر نصه إعلان مو اختبار.' },
  'home.proof.pending': { en: 'The test has not been run yet, so there are no numbers on this page. When it is run, the whole log goes here — the hours it held, and the hour it stopped.',
                  ar: 'الاختبار ما انسوى لين الحين، عشان جي ما تلقى أرقام بهالصفحة. أول ما ينسوى، بينزل السجل كامل هني — الساعات اللي صمد فيها، والساعة اللي وقف عندها.' },

  'home.fit.h': { en: 'Does it fit your car?', ar: 'يدخل بحامل سيارتك؟' },
  'home.fit.p': { en: 'A cup that will not sit in the holder is a cup you stop carrying. We are testing cars one at a time and publishing what we find, including the ones it does not fit.',
                  ar: 'الكوب اللي ما يستقر بالحامل بتوقف عن حمله. نختبر السيارات وحدة وحدة وننشر اللي يطلع معنا، حتى اللي ما يدخل فيها.' },
  'home.fit.pending': { en: 'No cars tested yet. This list will only ever hold cars we have physically put the cup into — never a guess off a spec sheet.',
                  ar: 'ما اختبرنا ولا سيارة لين الحين. هالقائمة بتضم بس السيارات اللي حطينا فيها الكوب بأيدينا، مو تخمين من ورقة مواصفات.' },

  'home.honest.h': { en: 'What we have not decided yet', ar: 'الأشياء اللي ما قررناها' },
  'home.honest.p': { en: 'We would rather leave a gap than fill it with something we made up. Not settled today: the price, the capacity, how long it holds, when the first batch exists, and how it reaches you.\nThere are no reviews here because nobody has used the cup yet. No logos, because nobody has partnered with us. No customer count, because there are no customers. Each of those appears the day it is real.',
                  ar: 'نفضّل نترك الفراغ على أن نعبيه بشي مألفينه. اللي ما استقرينا عليه اليوم: السعر، الحجم، كم ساعة يصمد، متى تنزل أول دفعة، وكيف توصلك.\nما في تقييمات هني لأن ما في أحد استخدم الكوب. وما في شعارات لأن ما في أحد شاركنا. وما في عدد زباين لأن ما في زباين. كل وحدة منها بتطلع يوم ما تصير حقيقة.' },

  'home.cup.hint': { en: 'Drag the cup to turn it. Arrow keys work too.',
                  ar: 'اسحب الكوب عشان تلفه. وأسهم الكيبورد تشتغل بعد.' },

  'home.collection.h': { en: 'The Kuwait Collection', ar: 'مجموعة الكويت' },
  'home.collection.p': { en: 'Fourteen colours, taken from Sadu rather than from a paint chart. Pick one and the cup above changes to it.\nA colour name should tell you something you can already picture.',
                  ar: 'أربعة عشر لون، مأخوذة من السدو مو من كتالوج دهانات. اختر وحدة وبيتغير الكوب اللي فوق.\nاسم اللون لازم يقول لك شي تقدر تتخيله من دون ما تشوفه.' },

  'home.sticker.h': { en: 'The name goes in the steel, not on a sticker',
                  ar: 'الاسم يدخل بالستيل، مو ملصق فوقه' },
  'home.sticker.p': { en: 'Stickers peel. Vinyl lifts in a car that has been sitting outside since ten in the morning. An engraving is material taken out of the surface, so it lasts exactly as long as the cup does.\nWrite it in Arabic or in Latin letters. A name, a nickname only two people use, a plate number. It is your cup, and we do not have opinions about what goes on it.',
                  ar: 'الملصقات تنقشر. والفينيل يطلع من سيارة واقفة برا من الساعة عشر الصبح. أما الحفر فهو مادة تنشال من السطح، عشان جي يعيش عمر الكوب نفسه.\nاكتبه بالعربي أو باللاتيني. اسم، أو لقب ما يعرفه إلا شخصين، أو رقم لوحة. هذا كوبك، وما عندنا رأي بالشي اللي ينكتب عليه.' },

  'home.claim5': { en: 'No plastic taste in the third sip.', ar: 'ولا طعم بلاستيك بالمصة الثالثة.' },
  'home.claim6': { en: 'No sticker to peel off in August.', ar: 'ولا ملصق ينقشر بشهر أغسطس.' },

  'home.notfor.h': { en: 'What it is not good for', ar: 'الأشياء اللي ما ينفع لها' },
  'home.price.pending': { en: 'The price is not published yet. Reserving costs nothing and takes no card either way.',
                  ar: 'السعر ما نزل لين الحين. والحجز ببلاش وما يحتاج بطاقة على كل حال.' },
  'home.price.label': { en: 'KWD', ar: 'د.ك' },

  /* ---- engraving ---- */

  'eng.title': { en: 'Engraving — cup.kw', ar: 'الحفر — cup.kw' },
  'eng.meta':  { en: 'Type your name in Arabic or English and see it on the cup before you commit.',
                 ar: 'اكتب اسمك بالعربي أو بالإنجليزي وشوفه على الكوب قبل ما تثبّت.' },
  'eng.h1':    { en: 'Put your name on it.', ar: 'حطّ اسمك عليه.' },
  'eng.lede':  { en: 'Type below. The cup keeps up with you. Nothing is saved until you say so.',
                 ar: 'اكتب تحت. الكوب يتحدث معاك أول بأول. وما ينحفظ شي لين ما تقول انت.' },
  'eng.label': { en: 'What it should say', ar: 'شنو يكتب عليه' },
  'eng.placeholder': { en: 'Your name', ar: 'اسمك' },
  'eng.script': { en: 'Script',  ar: 'الخط' },
  'eng.latin':  { en: 'Latin',   ar: 'لاتيني' },
  'eng.arabic': { en: 'Arabic',  ar: 'عربي' },
  'eng.colour': { en: 'Colour',  ar: 'اللون' },
  'eng.left':   { en: 'characters left', ar: 'حرف باقي' },
  'eng.over':   { en: 'Too long to cut cleanly at this size.', ar: 'طويل، ما ينحفر نظيف بهالحجم.' },
  'eng.warn.ar': { en: 'Arabic joins as it is cut. Short is better — long phrases close up at engraving size and stop being readable.',
                 ar: 'العربي يتوصل حروفه وقت الحفر. القصير أفضل — العبارات الطويلة تتلزّق بحجم الحفر وما تنقرا.' },
  'eng.warn.perm': { en: 'An engraving is permanent. Check the spelling now, because we cannot undo it later.',
                 ar: 'الحفر ما ينمسح. راجع الإملاء الحين، لأن ما نقدر نتراجع عنه بعدين.' },
  'eng.save':     { en: 'Save this to my cup', ar: 'احفظه على كوبي' },
  'eng.saveHint': { en: 'You will need an account. It takes an email and a password.',
                 ar: 'بتحتاج حساب. بس إيميل وكلمة سر.' },
  'eng.unavailable': { en: 'Engraving is not being taken at the moment.', ar: 'الحفر موقوف حالياً.' },

  /* ---- auth ---- */

  'auth.title': { en: 'Sign in — cup.kw', ar: 'الدخول — cup.kw' },
  'auth.h1':    { en: 'Sign in, or make an account.', ar: 'ادخل، أو سوِّ حساب.' },
  'auth.lede':  { en: 'Two boxes, two buttons. Your reservation and your engraving live behind them.',
                 ar: 'خانتين وزرين. حجزك وحفرك محفوظين وراهم.' },
  'auth.email':    { en: 'Email', ar: 'الإيميل' },
  'auth.password': { en: 'Password', ar: 'كلمة السر' },
  'auth.pwHint':   { en: 'Use a password you do not use anywhere else. It goes straight to our authentication provider, which keeps only a hash of it. This site never stores it and never logs it.',
                 ar: 'استخدم كلمة سر ما تستخدمها بمكان ثاني. تروح مباشرة لمزود المصادقة وهو يحفظ بصمتها بس. هالموقع ما يخزنها ولا يسجلها أبداً.' },
  'auth.signin':  { en: 'Sign in', ar: 'دخول' },
  'auth.signup':  { en: 'Create account', ar: 'حساب جديد' },
  'auth.working': { en: 'Working…', ar: 'لحظة…' },
  'auth.signout': { en: 'Sign out', ar: 'خروج' },

  'auth.err.credentials': { en: 'That email and password do not match an account. If you have not made one yet, use Create account.',
                 ar: 'الإيميل وكلمة السر ما يطابقون أي حساب. إذا ما سويت حساب، اضغط حساب جديد.' },
  'auth.err.exists': { en: 'There is already an account on that email. Use Sign in instead.',
                 ar: 'في حساب أصلاً على هالإيميل. اضغط دخول بدالها.' },
  'auth.err.weak': { en: 'That password is too short. Six characters at the very least.',
                 ar: 'كلمة السر قصيرة. ستة حروف على الأقل.' },
  'auth.err.email': { en: 'That does not look like an email address.', ar: 'هذا ما يشبه إيميل.' },
  'auth.err.unconfirmed': { en: 'The account exists and is waiting on you. Open the email we sent, click the link, then come back and sign in. This is not an error.',
                 ar: 'الحساب موجود وينتظرك. افتح الإيميل اللي وصلك واضغط الرابط، وبعدين ارجع وادخل. هذا مو خطأ.' },
  'auth.err.rate': { en: 'Too many tries in a row. Wait a minute and go again.',
                 ar: 'محاولات وايد ورا بعض. استنَ دقيقة وعيد.' },
  'auth.err.network': { en: 'We could not reach the server. Check your connection and try again.',
                 ar: 'ما قدرنا نوصل للسيرفر. تأكد من الاتصال وعيد المحاولة.' },
  'auth.err.nobackend': { en: 'This copy of the site has no database behind it — you are opening it from a file on disk. Nothing you typed went anywhere.',
                 ar: 'هالنسخة من الموقع ما وراها قاعدة بيانات — انت فاتحها من ملف على جهازك. ولا شي كتبته راح لأي مكان.' },
  'auth.signedup': { en: 'Account created. If a confirmation email arrives, click the link in it, then sign in.',
                 ar: 'انسوى الحساب. إذا وصلك إيميل تأكيد، اضغط الرابط اللي فيه وبعدها ادخل.' },

  /* ---- reserve ---- */

  'res.title': { en: 'Your cup — cup.kw', ar: 'كوبك — cup.kw' },
  'res.h1':    { en: 'Your cup', ar: 'كوبك' },
  'res.hello': { en: 'Hello, {name}.', ar: 'هلا، {name}.' },
  'res.intro': { en: 'Everything here belongs to your account. Nobody else can read it — the database will only ever hand your row to your own session.',
                 ar: 'كل اللي هني يخص حسابك. ما أحد يقدر يقراه — قاعدة البيانات ما تسلّم صفك إلا لجلستك انت.' },
  'res.qty':       { en: 'How many', ar: 'كم واحد' },
  'res.colour':    { en: 'Colour', ar: 'اللون' },
  'res.engraving': { en: 'Engraving', ar: 'الحفر' },
  'res.save':      { en: 'Save reservation', ar: 'احفظ الحجز' },
  'res.cancel':    { en: 'Cancel reservation', ar: 'ألغِ الحجز' },
  'res.saved':     { en: 'Saved. That is a real row in the database now.', ar: 'انحفظ. هذا صار صف حقيقي بقاعدة البيانات.' },
  'res.cancelled': { en: 'Cancelled. The row is deleted, not hidden.', ar: 'انلغى. الصف انمسح، ما انخفى.' },
  'res.none':      { en: 'You have not reserved anything yet. The form above is the whole process.',
                 ar: 'ما حجزت شي لين الحين. النموذج اللي فوق هو كل العملية.' },
  'res.what':      { en: 'A reservation is a row saying you want one. It is not an order, it holds no money, and it commits you to nothing. When there is a price and a date we write to this account, and you decide then.',
                 ar: 'الحجز صف يقول انك تبي وحدة. مو طلب، وما يمسك أي فلوس، وما يلزمك بشي. أول ما يصير في سعر وتاريخ بنكتب لهالحساب، وانت تقرر وقتها.' },
  'res.checking':  { en: 'Checking your session…', ar: 'نتأكد من جلستك…' },

  /* ---- shared ---- */

  'foot.note':   { en: 'cup.kw is a product being built in the open. Nothing on this site claims a fact we have not measured.',
                 ar: 'cup.kw منتج ينبني قدام الناس. ما في شي بهالموقع يدّعي حقيقة ما قسناها بنفسنا.' },
  'foot.source': { en: 'Source on GitHub', ar: 'الكود على GitHub' },
  'foot.contactPending': { en: 'Contact details go here once they are real.',
                 ar: 'معلومات التواصل بتنحط هني أول ما تصير حقيقية.' }
};
