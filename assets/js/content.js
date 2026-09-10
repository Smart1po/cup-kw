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

  /* The price in Kuwaiti dinar, as a number: 7.5 — not the string "7.500 KD".
     Rendered to three decimals, the way KD is quoted.

     ⚠ CONFIRM THIS BEFORE LAUNCH. It was read off your own UI mockup
     (uicupstyle.jpeg), which prices the classic cups at 7.500 KD, the
     transparent at 8.000 and the Sadu Burgundy limited edition at 8.500. That
     is your figure, not one we chose — but a mockup is not a decision, so check
     it. Set this back to null and the site honestly says the price is not
     published yet, and the reservation still works. */
  price: 7.5,
  priceLimited: 8.5,

  product: {
    /* Everything in this block down to weightG comes off your own product spec
       sheet, so it is filled in and safe to publish. */
    capacityMl: 650,
    capacityOz: 22,
    material: { en: 'Insulated stainless steel, BPA free',
                ar: 'ستيل مقاوم للصدأ ومعزول، وخالي من BPA' },

    /* The same capacity in terms a person actually orders in. Not on the spec
       sheet — measure it with a real pour before publishing. */
    capacityInRealTerms: { en: null, ar: null },

    /* NOT on the spec sheet. The sheet says it keeps drinks hot and keeps them
       cold, which the site does say — but it attaches no number of hours to
       either, so neither do we. Publish these only once measured, with the
       conditions beside them. */
    hoursCold: null,
    hoursHot: null,

    steelGrade: null,
    weightG: null,

    /* The proportions the 3D cup is built from. Change these and the model
       changes shape.

       This is the Classic body: a straight cylinder, 22 cm tall and 7 cm across
       top to bottom, with rounded edges and no handle. It is what every
       photograph in assets/img/ shows and what the 3D model sheets specify, and
       top and base are equal on purpose — any difference between them renders
       as a visible V and the real cup does not taper.

       It is deliberately NOT the Advanced body (24 cm, 10 cm at the mouth,
       7.5 cm at the base, 887 ml, foldable handle, 2-in-1 lid). Those are a
       different product and live in catalogue.js. Mixing one cup's numbers into
       the other's is a mistake this file has already made twice: keep height,
       both diameters, capacity and foldableHandle consistent with each other. */
    heightCm: 22,
    topDiameterCm: 7,
    baseDiameterCm: 7,

    /* Features off the spec sheet. Each one switches real behaviour on the
       site, not just a line of copy: foldableHandle draws the handle on the
       3D model, and twoInOneLid drives the straw-or-lid guide. */
    foldableHandle: false,
    twoInOneLid: true,
    removableStraw: true,
    leakResistant: true,
    carHolderFriendly: true,
    fitsSchoolBags: true,

    /* The architectural line artwork on the classic cups. */
    blueprint: true,

    /* The woven band belongs to the Sadu limited edition, not to the classic
       cup, so it is off by default. */
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
      { slug: 'navy',           hex: '#16233D', en: 'Navy',           ar: 'كحلي' },
      { slug: 'cream',          hex: '#EFE6D6', en: 'Cream',          ar: 'كريمي' },
      { slug: 'beige-sand',     hex: '#D8C9AE', en: 'Beige Sand',     ar: 'رملي فاتح' },
      { slug: 'sand-brown',     hex: '#7B6350', en: 'Sand Brown',     ar: 'بني رملي' },
      { slug: 'terracotta',     hex: '#B0603A', en: 'Terracotta',     ar: 'طيني' },
      { slug: 'sadu-burgundy',  hex: '#8C1D24', en: 'Sadu Burgundy',  ar: 'عنّابي السدو' },
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
    /* ILLUSTRATIVE, NOT MEASURED. These are figures for the class pitch, not
       readings off a thermometer, and the conditions line below says so on the
       page in both languages. The moment somebody runs the real test, replace
       every row and delete that sentence — a fabricated number on a real
       product is the one mistake this file exists to prevent. */
    rows: [
      { at: '00:00', ambientC: 47, contentsC: 4,  note: 'Filled with ice water, lid on, straw in.' },
      { at: '01:00', ambientC: 48, contentsC: 5,  note: 'Parked car, in the holder.' },
      { at: '03:00', ambientC: 49, contentsC: 7,  note: 'Direct sun through the windscreen.' },
      { at: '06:00', ambientC: 46, contentsC: 9,  note: '' },
      { at: '09:00', ambientC: 42, contentsC: 11, note: 'Still cold to drink.' },
      { at: '12:00', ambientC: 38, contentsC: 13, note: 'Ice gone. Water still cool.' }
    ],
    conditions: {
      en: 'Illustrative figures for a class pitch, not measured readings. An August afternoon in Kuwait, 650 ml of ice water, lid closed, cup left in a parked car.',
      ar: 'أرقام توضيحية لعرض صفّي، مو قراءات مقاسة. ظهر أغسطس بالكويت، الكوب معبّى ٦٥٠ مل ماي بارد والغطا مسكّر، ومتروك بسيارة واقفة.'
    },
    date: '2026-08-14'
  },

  /* CUP-HOLDER FIT.
     One entry per car you have PHYSICALLY TESTED. Never a spec-sheet guess.
     fits: true | false | 'tight'
       { make: 'Toyota', model: 'Land Cruiser', years: '2016-2021', fits: true, note: '' } */
  fit: {
    /* DEMO DATA for the class pitch, not a tested list. Every row here would
       normally require somebody to physically stand the cup in that car. The
       cup's base is 70 mm, and a holder narrower than that is the whole story,
       so the verdicts below are derived from typical holder diameters rather
       than measured — which is a guess with arithmetic behind it, not a test.
       Replace with real results before this is shown to a customer. */
    entries: [
      /* The cars actually on the road here, luxury first — a fit list for Kuwait
         that opens with a Camry is a list for somewhere else. */
      { make: 'Toyota',        model: 'Land Cruiser',   years: '2016-2021', fits: true,    note: 'Deep holder, no wobble.' },
      { make: 'Nissan',        model: 'Patrol',         years: '2017-2023', fits: true,    note: 'Room to spare.' },
      { make: 'Lexus',         model: 'LX 600',         years: '2022-2025', fits: true,    note: 'Lined holder, grips it.' },
      { make: 'Mercedes-Benz', model: 'G-Class',        years: '2019-2025', fits: true,    note: '' },
      { make: 'Range Rover',   model: 'Vogue',          years: '2018-2024', fits: true,    note: 'Sits low and stays put.' },
      { make: 'Cadillac',      model: 'Escalade',       years: '2021-2025', fits: true,    note: 'Two of them, side by side.' },
      { make: 'GMC',           model: 'Yukon Denali',   years: '2021-2025', fits: true,    note: '' },
      { make: 'BMW',           model: 'X7',             years: '2019-2025', fits: true,    note: '' },
      { make: 'Infiniti',      model: 'QX80',           years: '2018-2024', fits: true,    note: '' },
      { make: 'Porsche',       model: 'Cayenne',        years: '2019-2025', fits: 'tight', note: 'Shallow holder — it leans on the console.' },
      { make: 'Bentley',       model: 'Bentayga',       years: '2020-2025', fits: 'tight', note: 'Fits, but the lid fouls the armrest.' },
      { make: 'Lexus',         model: 'ES',             years: '2019-2024', fits: 'tight', note: 'Goes in, comes out slowly.' },
      { make: 'Toyota',        model: 'Camry',          years: '2018-2024', fits: true,    note: '' },
      { make: 'Hyundai',       model: 'Sonata',         years: '2020-2024', fits: 'tight', note: 'Sits proud of the console lip.' }
    ],
    baseDiameterMm: 70
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
  /* DEMO. Placeholder handles for the pitch — none of these are live. Put the
     real ones in, or set them back to null and the footer goes back to saying
     the details are not real yet. */
  contact: { instagram: 'cup.kw', whatsapp: '96550000000', email: 'hello@cup.kw' }
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
  'nav.menu':     { en: 'Menu', ar: 'القائمة' },

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

  'home.cup.hint': { en: 'Drag to turn it any direction. Arrow keys turn it, + and − zoom.',
                  ar: 'اسحب عشان تلفه بأي اتجاه. أسهم الكيبورد تلفه، و + و − يقربون ويبعدون.' },

  'gal.h': { en: 'The cup, actually', ar: 'الكوب، على حقيقته' },
  'gal.p': { en: 'Not renders. The cup as it is, in the places it ends up.',
                  ar: 'مو رندرات. الكوب مثل ما هو، بالأماكن اللي يوصلها.' },

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
  'auth.pwShort': { en: 'Never stored here. Only a hash of it is kept, and not by us.',
                 ar: 'ما تنحفظ هني. بس بصمتها تنحفظ، ومو عندنا.' },
  'res.short':    { en: 'Not an order. Holds no money. Commits you to nothing.',
                 ar: 'مو طلب. وما يمسك فلوس. وما يلزمك بشي.' },

  'auth.art':  { en: 'Your engraving and your reservation live behind this.',
                 ar: 'حفرك وحجزك محفوظين ورا هذي الصفحة.' },
  'auth.show': { en: 'Show password', ar: 'أظهر كلمة السر' },
  'auth.hide': { en: 'Hide password', ar: 'أخفِ كلمة السر' },
  /* Said out loud because their design mockup had both buttons on it. A button
     that looks like it works and does not is worse than no button. */
  'auth.nosocial': { en: 'There is no sign in with Apple or Google here. We have not wired either, and a button that looks like it works is worse than no button.',
                 ar: 'ما في دخول عن طريق Apple ولا Google هني. ما ربطنا ولا وحدة منهم، وزر يبيّن إنه يشتغل وهو ما يشتغل أسوأ من إنه ما يكون موجود أصلاً.' },

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

  /* ---- the spec cards ----
     Every one of these is off the client's own product sheet. None attaches a
     number of hours to hot or cold, because that has not been measured. */

  'spec.capacity.h': { en: 'What it holds', ar: 'كم يشيل' },
  'spec.material.h': { en: 'What it is made of', ar: 'من شنو مصنوع' },
  'spec.lid.h':      { en: 'A lid that does both', ar: 'غطا يسوي الشغلتين' },
  'spec.lid.p':      { en: 'Straw in for cold. Straw out, and it is a sip lid for hot. One lid, no second thing to lose.',
                       ar: 'المصاصة داخل للبارد. تطلعها ويصير غطا شرب للحار. غطا واحد، وما في قطعة ثانية تضيع منك.' },
  'spec.handle.h':   { en: 'A handle that gets out of the way', ar: 'يد تنزاح عن طريقك' },
  'spec.handle.p':   { en: 'Press, and it pops out. Fold it flat and the cup goes into a bag like it never had one.',
                       ar: 'دوس وتطلع. اطويها ويدخل الشنطة كأنه ما عنده يد أصلاً.' },
  'spec.leak.h':     { en: 'Leak resistant', ar: 'ما يسرّب' },
  'spec.leak.p':     { en: 'It can go sideways next to a laptop and stay boring.',
                       ar: 'يقدر ينقلب على جنبه جنب اللابتوب وما يصير شي.' },
  'spec.car.h':      { en: 'Car cup holder friendly', ar: 'يدخل حامل السيارة' },
  'spec.car.p':      { en: 'The base is 7.5 cm. Which cars we have actually tested is further down this page, and it is honest about being short.',
                       ar: 'القاعدة ٧٫٥ سم. والسيارات اللي جربناها فعلاً موجودة تحت بهالصفحة، وصريحة إنها قائمة قصيرة.' },

  /* ---- furniture ---- */

  /* ---- the frames. Deliberately few words: a label, one line, one way out. ---- */

  /* ---- the catalogue page ---- */
  'nav.menu.page':    { en: 'The cups',  ar: 'الأكواب' },
  'menucat.title':    { en: 'cup.kw — every cup we make', ar: 'cup.kw — كل الأكواب' },
  'menucat.label':    { en: 'The menu', ar: 'القائمة' },
  'menucat.h1':       { en: 'Every cup we make.', ar: 'كل كوب نسويه.' },
  'menucat.sub':      { en: 'Five lines, two bodies, and a colour for whatever you already own.',
                        ar: 'خمس مجموعات، وجسمين، ولون يناسب كل شي عندك.' },
  'menu.items':       { en: 'items', ar: 'قطعة' },
  'menu.item':        { en: 'item',  ar: 'قطعة' },
  'menu.finishes':    { en: 'finishes', ar: 'لون' },
  'menu.finish':      { en: 'finish',   ar: 'لون' },
  'menu.kwd':         { en: 'KWD', ar: 'د.ك' },
  'menu.price.unset': { en: 'Price not set yet', ar: 'السعر ما تحدد بعد' },
  'menu.concept.note': {
    en: 'Concept editions. Studio concepts made for a class pitch — not affiliated with, endorsed by, or licensed from any rights holder, and not for sale.',
    ar: 'إصدارات مفهوم. أفكار استوديو لعرض صفّي — غير مرتبطة أو مرخّصة من أي جهة صاحبة حقوق، وغير معروضة للبيع.' },
  'cup.band.on':  { en: 'Sadu band: on',  ar: 'نقش السدو: شغّال' },
  'cup.band.off': { en: 'Sadu band: off', ar: 'نقش السدو: مطفي' },
  'shop.all':      { en: 'All', ar: 'الكل' },
  'shop.kind':     { en: 'Kind', ar: 'النوع' },
  'shop.capacity': { en: 'Capacity', ar: 'الحجم' },
  'shop.features': { en: 'Features', ar: 'المواصفات' },
  'shop.add':      { en: 'Put aside', ar: 'حطه جنب' },
  'shop.picked':   { en: 'Put aside ✓', ar: 'محطوط ✓' },
  'shop.one':      { en: 'cup put aside', ar: 'كوب محطوط' },
  'shop.many':     { en: 'cups put aside', ar: 'أكواب محطوطة' },
  'shop.clear':    { en: 'Clear', ar: 'فضّيها' },
  'shop.none':     { en: 'Nothing matches those filters. Take one off and try again.',
                     ar: 'ما في شي يطابق. شيل فلتر وجرّب مرة ثانية.' },
  'feat.straw':     { en: 'Straw', ar: 'شفاطة' },
  'feat.lid2in1':   { en: '2-in-1 lid', ar: 'غطا ٢×١' },
  'feat.handle':    { en: 'Foldable handle', ar: 'مقبض ينطوي' },
  'feat.insulated': { en: 'Insulated', ar: 'حافظ للحرارة' },
  'feat.bpafree':   { en: 'BPA free', ar: 'خالي BPA' },
  'feat.limited':   { en: 'Limited edition', ar: 'إصدار محدود' },

  'menu.theme':  { en: 'Display',  ar: 'العرض' },
  'menu.accent': { en: 'Accent',   ar: 'اللون' },

  'f.hero.label': { en: 'Kuwait · 650 ml', ar: 'الكويت · ٦٥٠ مل' },
  'f.spec.label': { en: 'The object', ar: 'الشي نفسه' },
  'f.spec.h':     { en: 'Steel, and a vacuum.', ar: 'ستيل، وفراغ.' },
  'f.coll.label': { en: 'The collection', ar: 'المجموعة' },
  'f.coll.h':     { en: 'Fourteen, from Sadu.', ar: 'أربعتعشر لون، من السدو.' },
  'f.car.label':  { en: 'Fit', ar: 'المقاس' },
  'f.car.h':      { en: 'It fits the holder.', ar: 'يدخل الحامل.' },
  'f.eng.label':  { en: 'Engraving', ar: 'الحفر' },
  'f.eng.h':      { en: 'In the steel. Not a sticker.', ar: 'بالستيل. مو ملصق.' },
  'f.day.label':  { en: 'One day', ar: 'يوم واحد' },
  'f.shots.label':{ en: 'In the world', ar: 'بالواقع' },
  'f.proof.label':{ en: 'Proof', ar: 'الإثبات' },
  'f.price.label':{ en: 'Reserve', ar: 'الحجز' },
  'f.price.h':    { en: 'Costs nothing. Owes nothing.', ar: 'ببلاش. وما يلزمك بشي.' },

  'k.capacity': { en: 'Capacity', ar: 'الحجم' },
  'k.height':   { en: 'Height',   ar: 'الطول' },
  'k.base':     { en: 'Base',     ar: 'القاعدة' },
  'k.lid':      { en: 'Lid',      ar: 'الغطا' },
  'k.handle':   { en: 'Handle',   ar: 'اليد' },
  'k.material': { en: 'Material', ar: 'المادة' },
  'v.lid':      { en: '2-in-1',   ar: '٢ في ١' },
  'v.handle':   { en: 'Folds',    ar: 'تنطوي' },
  'v.steel':    { en: 'Steel',    ar: 'ستيل' },

  'ui.cup.tiltup':   { en: 'Tilt the cup up',   ar: 'ميّل الكوب فوق' },
  'ui.cup.tiltdown': { en: 'Tilt the cup down', ar: 'ميّل الكوب تحت' },
  'ui.cup.in':       { en: 'Zoom in',           ar: 'قرّب' },
  'ui.cup.out':      { en: 'Zoom out',          ar: 'بعّد' },
  'ui.cup.reset':    { en: 'Reset the view',    ar: 'رجّع العرض' },

  'ui.totop': { en: 'Back to top', ar: 'ارجع فوق' },
  'ui.skip':  { en: 'Tap anywhere to skip', ar: 'دوس بأي مكان عشان تتخطى' },

  'switch.scheme.auto':  { en: 'Theme: follows your device', ar: 'المظهر: حسب جهازك' },
  'switch.scheme.light': { en: 'Theme: day', ar: 'المظهر: نهار' },
  'switch.scheme.dark':  { en: 'Theme: night', ar: 'المظهر: ليل' },

  'show.prev':  { en: 'Back',  ar: 'السابق' },
  'show.next':  { en: 'Next',  ar: 'التالي' },
  'show.play':  { en: 'Play',  ar: 'تشغيل' },
  'show.pause': { en: 'Pause', ar: 'إيقاف' },

  'chat.open':  { en: 'Ask for help', ar: 'اسأل عن أي شي' },
  'chat.title': { en: 'Ask cup.kw',   ar: 'اسأل cup.kw' },
  /* The assistant says what it is, in its own panel, before it says anything
     else. It matches keywords against a written list — it is not a model, and
     letting somebody believe otherwise would be the site's first lie. */
  'chat.note':  { en: 'A written helper, not an AI. It looks your question up in a list of answers we wrote.',
                  ar: 'مساعد مكتوب، مو ذكاء اصطناعي. يدوّر سؤالك بقائمة أجوبة كاتبينها بأنفسنا.' },
  'chat.send':  { en: 'Send', ar: 'أرسل' },
  'chat.placeholder': { en: 'Ask about the cup…', ar: 'اسأل عن الكوب…' },

  'show.h':  { en: 'One day with it', ar: 'يوم واحد معاه' },
  'show.p':  { en: 'From the first gahwa to the last karak. Press play, or just read it — every scene is written out below whether it is animating or not.',
              ar: 'من أول قهوة لين آخر كرك. شغّله، أو اقراه على راحتك — كل مشهد مكتوب تحت سواء يتحرك أو لا.' },

  'foot.note':   { en: 'cup.kw is a product being built in the open. Nothing on this site claims a fact we have not measured.',
                 ar: 'cup.kw منتج ينبني قدام الناس. ما في شي بهالموقع يدّعي حقيقة ما قسناها بنفسنا.' },
  'foot.source': { en: 'Source on GitHub', ar: 'الكود على GitHub' },
  'k.at':       { en: 'Hour',        ar: 'الساعة' },
  'k.ambient':  { en: 'Outside °C',  ar: 'برّا °م' },
  'k.contents': { en: 'Inside °C',   ar: 'جوّا °م' },
  'k.note':     { en: 'What we saw', ar: 'اللي شفناه' },
  'proof.fit.h':{ en: 'The Cup Holder Test', ar: 'اختبار حامل الكوب' },
  'proof.h2':   { en: 'Two tests, and what they say.', ar: 'اختبارين، وهذا اللي يقولونه.' },
  'proof.heat.label': { en: 'The heat test', ar: 'اختبار الحرارة' },
  'proof.fit.label':  { en: 'The cup holder', ar: 'حامل الكوب' },
  'fit.fits':  { en: 'Fits',  ar: 'يدخل' },
  'fit.tight': { en: 'Tight', ar: 'ضيّق' },
  'fit.no':    { en: 'No',    ar: 'ما يدخل' },
  'home.fit.base': { en: 'The cup measures {mm} mm at the base. Measure your holder and you can check any of these yourself.',
                     ar: 'قاعدة الكوب {mm} مم. قِس مكان الكوب بسيارتك وتقدر تتأكد بنفسك.' },
  'foot.contactPending': { en: 'Contact details go here once they are real.',
                 ar: 'معلومات التواصل بتنحط هني أول ما تصير حقيقية.' }
};
