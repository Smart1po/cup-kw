/* The experience content: the waiting-screen lines, the day the cup lives
   through, and everything the assistant knows.

   Separated from content.js on purpose. content.js holds facts about the
   product and is the file the owner edits; this one holds voice, and editing
   it is a writing job rather than a data-entry one.

   The Arabic here was written natively in Kuwaiti register, not translated —
   several lines make a different joke in each language in order to land the
   same one. Do not "correct" it toward Modern Standard Arabic. */

window.CUP_EXPERIENCE = {
  "loading": [
    {
      "ar": "ثانية بس... الكوب أسرع من موقعنا.",
      "en": "One moment. The cup loads faster than the website."
    },
    {
      "ar": "الآيس لاتيه ما يصبر عليك. الكوب يصبر.",
      "en": "Your iced latte has no patience. The cup has plenty."
    },
    {
      "ar": "يمسك القهوة. خلصت المواصفات.",
      "en": "It holds coffee. That is the end of the spec sheet."
    },
    {
      "ar": "محفور عليه اسمك، عشان ما يصير \"كوب الدوام\".",
      "en": "Your name is on it, so it stops being \"the office cup\"."
    },
    {
      "ar": "زحمة شارع الخليج طويلة. قهوتك ما لازم تخلص وياها.",
      "en": "Gulf Road traffic is long. Your coffee doesn't have to end with it."
    },
    {
      "ar": "أغسطس ما يرحم. الكوب ما عنده رأي.",
      "en": "August shows no mercy. The cup has no opinion."
    },
    {
      "ar": "يدخل الكب هولدر عدل. أي سيارة؟ ما نبي نتورط.",
      "en": "Fits the cup holder. Which car? We're not naming names."
    },
    {
      "ar": "الجاي بالديوانية يبرد من ثالث سالفة. مب من اليوم.",
      "en": "Diwaniya tea used to go cold by the third story. Not tonight."
    },
    {
      "ar": "ما في شي أبرد من قهوة نسيتها على المكتب. الحين تنساها وهي حارة.",
      "en": "Nothing is colder than a coffee you forgot. Now you can forget it warm."
    },
    {
      "ar": "الكرك من المحل لين البيت. يوصل شراب، مب ذكرى.",
      "en": "Karak from the stand to your door. Arrives as a drink, not a memory."
    },
    {
      "ar": "الرسمة اللي عليه مخطط هندسي. لكوب. إي صج.",
      "en": "The artwork is an architectural drawing. Of a cup. Yes, really."
    },
    {
      "ar": "متين. مب معناته تجرّب.",
      "en": "Durable. That is not an invitation to test it."
    },
    {
      "ar": "اليد تنطوي. عشان الشنطة، مب عشان الاستعراض.",
      "en": "The handle folds. For your bag, not for the camera."
    },
    {
      "ar": "مصاصة داخل للبارد، وبرا للحار. أصعب قرار بيومك.",
      "en": "Straw in for cold, out for hot. Hardest decision of your day."
    },
    {
      "ar": "٨٨٧ مل. تعبّي مرة وحدة وتسكت.",
      "en": "887 ml. One fill, no follow-up questions."
    },
    {
      "ar": "ما يسرّب. شنطتك ترتاح.",
      "en": "Leak resistant. Your bag can finally relax."
    },
    {
      "ar": "ستانلس ستيل. بيعيش أطول من أغلب قراراتك بالشرا.",
      "en": "Stainless steel. It will outlive most of your other purchases."
    },
    {
      "ar": "كوب مثل كوبك؟ ماكو. حفرنا اسمك عليه.",
      "en": "A cup exactly like yours? Doesn't exist. Your name saw to that."
    },
    {
      "ar": "باقي شوي... روح عبّي ماي، وترجع تلقانا خلصنا.",
      "en": "Almost there. Go fill something up. We'll be ready when you're back."
    }
  ],
  "show": {
    "scenes": [
      {
        "id": "gahwa",
        "timeOfDay": "06:40",
        "headlineEn": "Straw Out. Gahwa In.",
        "headlineAr": "طلّع المصّاصة… القهوة وصلت",
        "bodyEn": "Flip the lid, pull the straw out, pour. Straw out means hot — the gahwa stays hot while you're still looking for your keys.",
        "bodyAr": "افتح الغطا، طلّع المصّاصة، وصبّ. المصّاصة برّا يعني حار — والقهوة تظل حارة وانت لين الحين تدوّر المفاتيح.",
        "prop": "hot",
        "expression": "idle",
        "angle": -14
      },
      {
        "id": "car",
        "timeOfDay": "07:50",
        "headlineEn": "The Cup Holder Test",
        "headlineAr": "يدخل مكانه بالسيارة… وما يطلع",
        "bodyEn": "Base is 7 cm. It drops into the holder, it sits, and it does not rattle its way around the Fifth Ring.",
        "bodyAr": "قاعدته ٧ سم. تحطه بحاضن الكوب ويثبت، وما يترنّح لا عند المطب ولا بالدائري الخامس.",
        "prop": "car",
        "expression": "car",
        "angle": 26,
        "photo": {
          "src": "assets/img/in-car.jpg",
          "altEn": "The cup standing in a car cup holder, a hand resting on it",
          "altAr": "الكوب واقف بحامل أكواب السيارة، ويد ماسكته"
        }
      },
      {
        "id": "heat",
        "timeOfDay": "13:10",
        "headlineEn": "Summer Does Its Worst",
        "headlineAr": "الصيف يسوي اللي عنده",
        "bodyEn": "Straw in, lid shut — that's the cold side of the 2-in-1. How many hours? We won't say, because we haven't tested it and we don't invent numbers.",
        "bodyAr": "دخّل المصّاصة وسكّر الغطا — هذا وجه البارد. كم ساعة؟ ما نقول، لأننا ما قسناها وما نبيع أرقام.",
        "prop": "heat",
        "expression": "heat",
        "angle": -6,
        "photo": {
          "src": "assets/img/poolside.jpg",
          "altEn": "A hand lifting the cup off a concrete table beside a pool in full sun",
          "altAr": "يد ترفع الكوب من طاولة خرسانية جنب المسبح والشمس طالعة"
        }
      },
      {
        "id": "bag",
        "timeOfDay": "15:30",
        "headlineEn": "Press. Fold. Zip.",
        "headlineAr": "اضغط… ينطوي… وسكّر الشنطة",
        "bodyEn": "Press to unlock and the handle pops out. Press again and it folds flat — flat enough that most school bags close over it.",
        "bodyAr": "اضغط ينفك المسكة وتطلع. ارجع اضغط تنطوي وتلزق بالجدار — لدرجة إن أغلب شنط المدرسة تسكّر عليه بدون معارك مع السحّاب.",
        "prop": "bag",
        "expression": "bag",
        "angle": -30
      },
      {
        "id": "hand",
        "timeOfDay": "18:00",
        "headlineEn": "No Handle. No Problem.",
        "headlineAr": "بلا مسكة… ولا يهمّك",
        "bodyEn": "Handle folded, hand around the body. Same cup, one hand, walking the Gulf Road while the sun gives up for the day.",
        "bodyAr": "المسكة مطويّة والكف على الكوب. نفس الكوب، يد وحدة، ومشية على شارع الخليج والشمس تسلّم وتروح.",
        "prop": "held",
        "expression": "held",
        "angle": 10,
        "photo": {
          "src": "assets/img/in-hand.jpg",
          "altEn": "The cup held in one hand against a plain background, showing its size",
          "altAr": "الكوب بيد وحدة على خلفية بيضاء، وباين حجمه"
        }
      },
      {
        "id": "diwaniya",
        "timeOfDay": "21:40",
        "headlineEn": "Ten Cups on the Table. One Has Your Name On It.",
        "headlineAr": "عشر أكواب عالطاولة… وحده عليه اسمك",
        "bodyEn": "Karak, the diwaniya, and everyone brought the same cup. Except yours is engraved — that's the whole point.",
        "bodyAr": "كرك، وديوانية، والكل جايب نفس الكوب. بس مالك عليه نقش باسمك — وهذي القصة كلها: مالك انت، مو مال الكل.",
        "prop": "night",
        "expression": "proud",
        "angle": 0
      },
      {
        "id": "counter",
        "timeOfDay": "23:20",
        "headlineEn": "Everything Comes Apart. Everything Goes Back.",
        "headlineAr": "كل شي ينفك… وكل شي يرجع مكانه",
        "bodyEn": "Lid off, straw out, rinsed, and standing on the counter waiting for tomorrow's gahwa. It holds coffee. That is the whole feature list.",
        "bodyAr": "شيل الغطا، طلّع المصّاصة، غسلة، ويوقف على الرخامة ينتظر قهوة باجر. يحفظ القهوة. وهذي كل قائمة المزايا.",
        "prop": "idle",
        "expression": "idle",
        "angle": -20,
        "photo": {
          "src": "assets/img/cold-drink.jpg",
          "altEn": "The cup with its lid off beside it, filled with an iced drink and a steel straw",
          "altAr": "الكوب وغطاه مشلوع جنبه، ومعبّى شراب بارد وفيه مصاصة ستيل"
        }
      }
    ]
  },
  "chat": {
    "greeting": {
      "en": "Hello. I am a script with a hand-written list of answers, not an AI — I match your words against the list, and I do not guess. Ask about the cup, the lid, the handle, the engraving, the colours, or reserving one. Price, delivery and warranty are not published anywhere yet, and I will tell you that plainly rather than invent a number.",
      "ar": "هلا. أنا سكربت عنده أجوبة مكتوبة باليد، مب ذكاء اصطناعي — أقارن كلامك بالقائمة، وما أخمن. اسألني عن الكوب، الغطا، اليد، النقش، الألوان، أو الحجز. السعر والتوصيل والضمان لين الحين مب منشورين، وبقول لك چذي على طول بدال ما أخترع رقم."
    },
    "fallback": {
      "en": "I do not have that one. I am a written list, not something that can work an answer out — so instead of guessing, here is what I do cover: the cup itself, the lid and the straw, the handle, cleaning, the engraving, the colours, reserving, and your account. Price, delivery time and warranty are not published anywhere, here included, and I would rather say that than make something up. For anything outside the list, the contact link on this site reaches an actual person.",
      "ar": "ما عندي جواب لهذا. أنا قائمة مكتوبة، مب شي يقدر يستنتج — فبدال ما أخمن، هذا اللي أعرفه: الكوب نفسه، الغطا والمصاصة، اليد، الغسيل، النقش، الألوان، الحجز، وحسابك. أما السعر ووقت التوصيل والضمان فمب منشورين، لا هني ولا بأي مكان ثاني، وأفضل أقولها لك بصراحة بدال ما أختلق شي. وأي سؤال برا القائمة، رابط التواصل بالموقع يوصلك لإنسان."
    },
    "entries": [
      {
        "id": "what-it-is",
        "keywordsEn": [
          "what is",
          "cup kw",
          "what do you sell",
          "tell me about",
          "the product",
          "what is it",
          "the cup",
          "brand",
          "feature list",
          "what does it do"
        ],
        "keywordsAr": [
          "cup kw",
          "شنو هذا",
          "شنو تبيعون",
          "المنتج",
          "الكوب",
          "شنو القصه",
          "عن الشركه",
          "شنو يسوي"
        ],
        "questionEn": "What is cup.kw?",
        "questionAr": "شنو هو cup.kw؟",
        "answerEn": "cup.kw makes one thing: an insulated stainless steel cup that holds 887 ml, with a 2-in-1 flip lid and a handle that folds flat. It holds coffee. That is the whole feature list, and we think that is plenty. What makes it yours rather than everyone's is the engraving on the side.",
        "answerAr": "‏cup.kw يسوي شي واحد بس: كوب ستيل معزول يشيل 887 مل، غطاه 2-في-1، ويده تنطوي وترجع مستوية. يحفظ لك القهوة — هذي كل قائمة المزايا، واحنا شايفينها وايد. واللي يخليه مالك إنت مب مال الكل، هو النقش اللي على جنبه."
      },
      {
        "id": "capacity",
        "keywordsEn": [
          "capacity",
          "how much does it hold",
          "hold",
          "ml",
          "oz",
          "ounce",
          "887",
          "volume",
          "how much water",
          "litre",
          "liter"
        ],
        "keywordsAr": [
          "كم يشيل",
          "يشيل",
          "سعه",
          "مل",
          "اونصه",
          "887",
          "كميه",
          "كم ماي"
        ],
        "questionEn": "How much does it hold?",
        "questionAr": "كم يشيل؟",
        "answerEn": "887 ml — about 30 oz. In practical terms: enough gahwa to get through a working day, or a morning's water in one fill instead of four trips to the cooler.",
        "answerAr": "‏887 مل، يعني تقريب 30 أونصة. وبلغة الاستخدام: قهوة تكفيك الدوام من أوله لآخره، أو ماي تعبيه مرة وحدة الصبح بدال أربع طلعات للكولر."
      },
      {
        "id": "size",
        "keywordsEn": [
          "how big",
          "dimension",
          "tall",
          "height",
          "cm",
          "width",
          "diameter",
          "base",
          "measurement",
          "size",
          "27"
        ],
        "keywordsAr": [
          "مقاس",
          "طول",
          "حجم",
          "قياس",
          "سم",
          "قطر",
          "عرض",
          "27",
          "كم طوله"
        ],
        "questionEn": "How big is it?",
        "questionAr": "شنو مقاسه؟",
        "answerEn": "About 22 cm tall and about 7 cm across, the same width top to bottom. The width is the one that matters for a cup holder; the height is the one that matters for a bag.",
        "answerAr": "طوله تقريب ٢٢ سم وقطره تقريب ٧ سم، نفس العرض من فوق لتحت. رقم العرض هو اللي يهمك لحامل الكوب بالسيارة، ورقم الطول هو اللي يهمك للشنطة."
      },
      {
        "id": "materials",
        "keywordsEn": [
          "made of",
          "material",
          "steel",
          "stainless",
          "bpa",
          "plastic",
          "metal",
          "leak",
          "leak proof",
          "durable",
          "tough",
          "quality"
        ],
        "keywordsAr": [
          "مصنوع",
          "ستيل",
          "ستانلس",
          "خامه",
          "ماده",
          "بلاستيك",
          "معدن",
          "تسريب",
          "يسرب",
          "bpa",
          "متين"
        ],
        "questionEn": "What is it made of?",
        "questionAr": "من شنو مصنوع؟",
        "answerEn": "Insulated stainless steel, BPA free. The lid is leak resistant — that means it survives being in a bag, not that you can lay it on its side full and forget about it. It is durable, and it is meant to be thrown into a bag rather than kept on a shelf. It has been left in a car in August and has not made a thing of it.",
        "answerAr": "ستيل ستانلس معزول، وخالي من BPA. والغطا مانع للتسريب — يعني يتحمل إنه ينحط بشنطة، مب يعني تقلبه وهو معبى وتنساه. وهو متين، ومصمم عشان ينرمى بالشنطة مب عشان ينحط بالفترينة. انترك بسيارة بشهر أغسطس وما ذكر الموضوع أبد."
      },
      {
        "id": "lid",
        "keywordsEn": [
          "lid",
          "flip",
          "2 in 1",
          "two in one",
          "cap",
          "top",
          "which side",
          "open it",
          "cold drink",
          "hot or cold"
        ],
        "keywordsAr": [
          "غطا",
          "غطاء",
          "يقلب",
          "2 في 1",
          "وضعيه",
          "فتحه",
          "بارد",
          "اي جهه"
        ],
        "questionEn": "How does the lid work?",
        "questionAr": "شلون يشتغل الغطا؟",
        "answerEn": "One lid, two jobs. Flip it so the straw is in and you have a cold drink cup. Flip it the other way so the straw is out and you drink from the opening — that is the hot side. Two perspectives, same purpose.",
        "answerAr": "غطا واحد وله وضعيتين. تقلبه والمصاصة داخل، صار كوب مشروب بارد. وتقلبه بالعكس والمصاصة برا وتشرب من الفتحة، وهذي جهة الحار. وجهتين نظر، نفس الهدف."
      },
      {
        "id": "hot-straw",
        "keywordsEn": [
          "hot through the straw",
          "straw hot",
          "hot drink",
          "hot coffee",
          "burn",
          "tea",
          "sip",
          "scald",
          "chai"
        ],
        "keywordsAr": [
          "حار",
          "قهوه حاره",
          "شاي",
          "يحرق",
          "رشفه",
          "اشرب حار",
          "سخون"
        ],
        "questionEn": "Can I drink something hot through the straw?",
        "questionAr": "أقدر أشرب شي حار من المصاصة؟",
        "answerEn": "We would rather you did not, and the lid is built the other way round on purpose. Straw out for hot, and you drink from the opening so the first sip arrives slowly. A straw sends a hot drink straight past the part of your mouth that usually warns you.",
        "answerAr": "ما ننصح، والغطا مصمم بالعكس عن قصد. للحار تطلع المصاصة وتشرب من الفتحة عشان أول رشفة تنزل على مهلها. المصاصة توصل الشي الحار جوه من دون ما تحس فيه إلا بعد ما يفوت الوقت."
      },
      {
        "id": "handle",
        "keywordsEn": [
          "handle",
          "grip",
          "fold",
          "foldable",
          "carry",
          "hold it",
          "strap"
        ],
        "keywordsAr": [
          "يد",
          "مقبض",
          "تنطوي",
          "طي",
          "امسكه",
          "احمله"
        ],
        "questionEn": "Tell me about the handle",
        "questionAr": "شنو قصة اليد؟",
        "answerEn": "Press to unlock and it pops out. Fold it flat and the cup goes into a bag as though it never had a handle at all. No handle, no problem.",
        "answerAr": "تضغط الزر، تنفك وتطلع. وتنطوي وترجع مستوية، وعندها يدخل الشنطة كأنه أصلاً ما عنده يد. ما في يد؟ ما في مشكلة."
      },
      {
        "id": "straw",
        "keywordsEn": [
          "straw",
          "removable straw",
          "take the straw out",
          "reusable straw",
          "sipper",
          "lose the straw"
        ],
        "keywordsAr": [
          "مصاص",
          "شفاط",
          "ستروه",
          "تنشال",
          "تطلع المصاصه",
          "اشيل المصاصه"
        ],
        "questionEn": "Is the straw removable?",
        "questionAr": "المصاصة تنشال؟",
        "answerEn": "Yes, it comes all the way out. Take it out to wash it properly, or take it out because you are drinking something hot and do not want it in the way.",
        "answerAr": "أي، تطلع كاملة. تشيلها عشان تغسلها عدل، أو تشيلها لأنك تشرب شي حار وما تبيها بالطريق."
      },
      {
        "id": "car-holder",
        "keywordsEn": [
          "car",
          "cup holder",
          "holder",
          "drive",
          "driving",
          "vehicle",
          "fit in my car",
          "console"
        ],
        "keywordsAr": [
          "سياره",
          "حامل الكوب",
          "حامل",
          "اسوق",
          "يدخل بالسياره",
          "الدريشه"
        ],
        "questionEn": "Will it fit my car cup holder?",
        "questionAr": "يدخل بحامل الكوب بالسيارة؟",
        "answerEn": "It is cup holder friendly and the base is about 7 cm across. We are not going to tell you it fits your car, because we have not sat in your car and no two holders are the same. Measure yours once and you will know for certain instead of hoping.",
        "answerAr": "مصمم لحامل الكوب وقاعدته تقريب ٧ سم. بس ما راح نقول لك إنه يدخل بسيارتك إنت، لأننا ما جربنا سيارتك ولا في حاملين متطابقين. قيس حاملك مرة وحدة وبتعرف أكيد بدال ما تتمنى."
      },
      {
        "id": "bag-fit",
        "keywordsEn": [
          "bag",
          "school bag",
          "backpack",
          "rucksack",
          "fit in a bag",
          "satchel",
          "commute",
          "handbag"
        ],
        "keywordsAr": [
          "شنطه",
          "شنطه المدرسه",
          "باكباك",
          "المدرسه",
          "يدخل بالشنطه"
        ],
        "questionEn": "Does it fit in a school bag?",
        "questionAr": "يدخل بشنطة المدرسة؟",
        "answerEn": "Fold the handle flat and it fits most school bags. It is about 27 cm tall, so measure the height of the bag rather than the width — height is what catches.",
        "answerAr": "اطوِ اليد وبيدخل بأغلب شنط المدرسة. طوله تقريب 27 سم، فقيس طول الشنطة مب عرضها — الطول هو اللي يعلق عادة."
      },
      {
        "id": "cleaning",
        "keywordsEn": [
          "clean",
          "wash",
          "dishwasher",
          "soap",
          "smell",
          "stain",
          "hygiene",
          "rinse",
          "scrub",
          "washing up"
        ],
        "keywordsAr": [
          "اغسل",
          "غسيل",
          "غساله",
          "غساله الصحون",
          "صابون",
          "ريحه",
          "تنظيف",
          "نظف"
        ],
        "questionEn": "How do I clean it, and is it dishwasher safe?",
        "questionAr": "شلون أغسله؟ وينفع بغسالة الصحون؟",
        "answerEn": "Hand washing is straightforward: lid off, straw out, and warm water and soap reach everything. The dishwasher is not on our spec sheet, so we are not going to say yes to it — we would be guessing with your cup. Hand washing takes about a minute and it is what we can actually stand behind. Worth doing daily if it is carrying gahwa.",
        "answerAr": "الغسيل باليد سهل: شيل الغطا، طلّع المصاصة، والماي الدافي والصابون يوصلون كل مكان. أما غسالة الصحون فمب مذكورة بمواصفاتنا، وما بنقول \"أي\" على شي مب مكتوب عندنا — بنكون نخمّن بكوبك إنت. الغسل باليد ياخذ دقيقة، وهذا اللي نقدر نقوله بثقة. ويستاهل كل يوم إذا كان يشيل قهوة."
      },
      {
        "id": "fizzy",
        "keywordsEn": [
          "fizzy",
          "carbonated",
          "soda",
          "pepsi",
          "cola",
          "sparkling",
          "gas",
          "seltzer",
          "energy drink"
        ],
        "keywordsAr": [
          "غازي",
          "بيبسي",
          "كولا",
          "مشروب غازي",
          "غاز",
          "سفن",
          "مشروب طاقه"
        ],
        "questionEn": "Can I put a fizzy drink in it?",
        "questionAr": "ينفع أحط فيه مشروب غازي؟",
        "answerEn": "We have not tested it and there is nothing published about pressure, so we are not going to promise you anything either way. If you do it, leave room at the top and open it pointed away from your face. Leak resistant is a claim about a lid in a bag — it is not a claim about a carbonated drink.",
        "answerAr": "ما جربناه وما عندنا شي مكتوب عن الضغط، فما بنوعدك بشي لا بهالجهة ولا بذيك. إذا سويتها، لا تعبيه للفوق وافتحه وهو بعيد عن ويهك. \"مانع للتسريب\" وصف لغطا داخل شنطة، مب وعد لمشروب غازي."
      },
      {
        "id": "hot-cold-hours",
        "keywordsEn": [
          "how many hours",
          "how long does it stay hot",
          "stay hot",
          "stay cold",
          "keep hot",
          "keep cold",
          "insulation",
          "insulated",
          "temperature",
          "degrees",
          "thermal",
          "ice",
          "overnight"
        ],
        "keywordsAr": [
          "كم ساعه",
          "يبرد",
          "يحفظ الحراره",
          "حراره",
          "عزل",
          "يضل حار",
          "يضل بارد",
          "ثلج",
          "درجه",
          "لين متى"
        ],
        "questionEn": "How many hours does it keep drinks hot or cold?",
        "questionAr": "كم ساعة يحفظ المشروب حار أو بارد؟",
        "answerEn": "There is no number, and I am not going to hand you one. It keeps drinks hot and it keeps drinks cold — that much is on the spec sheet. The hours are not, because nobody has run that test properly and nothing has been published. A figure we invented would be worth less to you than this sentence. Fill it in the morning and judge it yourself; if you do, tell us what you found — that is how a real number eventually gets published.",
        "answerAr": "ما في رقم، وما بأعطيك واحد من راسي. يحفظ الحار حار ويحفظ البارد بارد — هذا مكتوب بالمواصفات. أما الساعات فلا، لأن ما أحد سوّى الاختبار عدل وما انتشر شي. ورقم نخترعه يسوى لك أقل من هالكلام. عبّيه الصبح وشوف بنفسك، وإذا جربت خبّرنا — چذي بالضبط يطلع رقم حقيقي بيوم من الأيام."
      },
      {
        "id": "engraving-what",
        "keywordsEn": [
          "engrav",
          "personalis",
          "personaliz",
          "custom",
          "name on it",
          "my name",
          "laser",
          "what can i put",
          "how many characters",
          "character limit",
          "how long can",
          "how long does the engraving"
        ],
        "keywordsAr": [
          "نقش",
          "حفر",
          "اسمي",
          "تخصيص",
          "ليزر",
          "كم حرف",
          "كلمه",
          "شنو اكتب",
          "كم ياخذ وقت"
        ],
        "questionEn": "What is the engraving?",
        "questionAr": "شنو النقش؟",
        "answerEn": "Your name, or a word that belongs to you, cut into the side of the cup. It is the point of the whole thing — yours, not everyone's. A cup with your name on it comes back to you off a diwaniya counter; a plain one just quietly becomes somebody else's. On length: it is a panel on the side of a cup, so think a name or a short phrase rather than a sentence. No exact character count has been published, so put down what you want when you reserve and it gets confirmed with you before anything is cut. How long it takes is tied to the batch and is not published either — I am not going to give you a date I do not have.",
        "answerAr": "اسمك، أو كلمة تخصك إنت، محفورة بجنب الكوب. وهذا بيت القصيد كله: مالك إنت، مب مال الكل. الكوب اللي عليه اسمك يرجع لك من كاونتر الديوانية؛ واللي بدون اسم ينتهي مال أحد ثاني بهدوء. وعن الطول: المساحة مساحة جنب كوب، يعني فكّر باسم أو عبارة قصيرة مب جملة. وما في عدد حروف منشور بالضبط، فاكتب اللي تبيه وقت الحجز ويتأكد معك قبل لا ينحفر أي شي. أما كم ياخذ وقت، فهو مرتبط بالدفعة ومب منشور — وما بأعطيك تاريخ ما هو عندي."
      },
      {
        "id": "engraving-scripts",
        "keywordsEn": [
          "arabic",
          "english",
          "script",
          "language",
          "letters",
          "font",
          "calligraphy",
          "both languages",
          "can you write arabic"
        ],
        "keywordsAr": [
          "عربي",
          "انجليزي",
          "لاتيني",
          "خط",
          "لغه",
          "حروف",
          "خطوط",
          "بالعربي"
        ],
        "questionEn": "Can I have it engraved in Arabic?",
        "questionAr": "أقدر أنقش بالعربي؟",
        "answerEn": "Yes, and properly — connected Arabic, not letters chopped apart the way software does it when nobody checked. Latin works too, and one of each on the same cup is fine. Bear in mind that a name in Arabic and the same name in Latin sit differently on the panel, so they will not look identical in length.",
        "answerAr": "أي، وبشكل صحيح — عربي موصول، مب حروف مقطعة عن بعض مثل ما تسويها البرامج إذا ما أحد راجعها. واللاتيني يمشي، وتقدر تحط الاثنين على نفس الكوب. بس خذ ببالك إن الاسم بالعربي ياخذ مساحة غير عن نفس الاسم باللاتيني، فما بيطلعون بنفس الطول."
      },
      {
        "id": "engraving-permanent",
        "keywordsEn": [
          "permanent",
          "forever",
          "wear off",
          "rub off",
          "scratch off",
          "fade",
          "undo",
          "change the engraving",
          "remove the name",
          "regret"
        ],
        "keywordsAr": [
          "دائم",
          "ينمسح",
          "يمسح",
          "يتقشر",
          "اغير النقش",
          "يروح",
          "للابد",
          "اندم"
        ],
        "questionEn": "Is the engraving permanent?",
        "questionAr": "النقش دائم؟",
        "answerEn": "Permanent. It is cut into the steel, so it does not wash off, peel or fade. It also cannot be changed afterwards, which is the part worth two minutes of thought before you type a name in. Until the batch is cut you can still edit it from your reservation; after that, it is the cup's name.",
        "answerAr": "دائم. محفور بالستيل نفسه، فما ينمسح ولا يتقشر ولا يبهت. وبنفس الوقت ما ينغيّر بعدين، وهذي النقطة اللي تستاهل دقيقتين تفكير قبل ما تكتب الاسم. وقبل لا تنحفر الدفعة تقدر تعدله من حجزك؛ وبعدها يصير هو اسم الكوب."
      },
      {
        "id": "colours",
        "keywordsEn": [
          "colour",
          "color",
          "navy",
          "white",
          "burgundy",
          "sadu",
          "matcha",
          "clear",
          "transparent",
          "blueprint",
          "range",
          "collection",
          "limited edition",
          "which ones",
          "options"
        ],
        "keywordsAr": [
          "لون",
          "الوان",
          "كحلي",
          "ابيض",
          "سدو",
          "بيرغندي",
          "ماتشا",
          "شفاف",
          "اصدار محدود",
          "مجموعه",
          "خيارات"
        ],
        "questionEn": "What colours are there?",
        "questionAr": "شنو الألوان الموجودة؟",
        "answerEn": "Four. Navy Blueprint and White Blueprint are the classic matte pair, both carrying the blueprint artwork — an architectural line drawing of the cup itself. Sadu Burgundy is a limited edition, so when that run is finished it is finished. Matcha Clear is transparent, and shows you exactly how much is left, for better or worse.",
        "answerAr": "أربعة. ‏Navy Blueprint و White Blueprint هما الثنائي الكلاسيكي المطفي، وعليهم رسمة الـ blueprint — رسمة هندسية بالخطوط للكوب نفسه. و Sadu Burgundy إصدار محدود، يعني أول ما تخلص الكمية خلصت. و Matcha Clear شفاف، ويوريك كم باقي بالضبط، سواء عجبك الجواب أو لا."
      },
      {
        "id": "price",
        "keywordsEn": [
          "price",
          "how much is it",
          "how much does it cost",
          "cost",
          "kd",
          "dinar",
          "expensive",
          "cheap",
          "pay",
          "money",
          "afford",
          "budget"
        ],
        "keywordsAr": [
          "سعر",
          "بكم",
          "كم يكلف",
          "دينار",
          "فلوس",
          "غالي",
          "رخيص",
          "كم سعره",
          "ميزانيه"
        ],
        "questionEn": "How much does it cost?",
        "questionAr": "بكم الكوب؟",
        "answerEn": "The price is not published yet. There is no figure on this site because there is no figure we are ready to stand behind, and putting one up today only to change it later is worse than saying this to you now. What you can do instead: reserving costs nothing and asks for no card, and you will be told the price before you are ever asked to pay anything. Nobody gets surprised by a number at the last step.",
        "answerAr": "السعر مب منشور لين الحين. ما في رقم بالموقع لأن ما في رقم جاهزين نلتزم فيه، وإننا نحط رقم اليوم ونغيره بعدين أسوأ من هالجملة اللي أقولها لك الحين. وشنو تقدر تسوي بداله: الحجز ببلاش وما يطلب منك بطاقة، والسعر يوصلك قبل لا يطلب منك أي فلوس. ما أحد بينصدم برقم بآخر خطوة."
      },
      {
        "id": "reserve-how",
        "keywordsEn": [
          "how do i reserve",
          "reserve",
          "order one",
          "buy",
          "get one",
          "sign up for one",
          "preorder",
          "pre order",
          "purchase",
          "waitlist",
          "join the list"
        ],
        "keywordsAr": [
          "احجز",
          "حجز",
          "اشتري",
          "اطلب",
          "شلون اخذ",
          "ابي واحد",
          "انتظار"
        ],
        "questionEn": "How do I reserve one?",
        "questionAr": "شلون أحجز واحد؟",
        "answerEn": "Four steps and no payment. Create an account with your email, confirm the email, choose a colour, and write down what you want engraved. That is the whole thing. No card is asked for at any point in it.",
        "answerAr": "أربع خطوات وبدون دفع. سوِ حساب بإيميلك، أكّد الإيميل، اختر اللون، واكتب النقش اللي تبيه. وهذا كل شي. وما ينطلب منك بطاقة بأي خطوة منها."
      },
      {
        "id": "reservation-what",
        "keywordsEn": [
          "what is a reservation",
          "what does a reservation mean",
          "am i buying",
          "is it an order",
          "committed",
          "commitment",
          "obligation",
          "binding",
          "deposit",
          "does it cost me"
        ],
        "keywordsAr": [
          "يعني شنو الحجز",
          "الحجز يعني",
          "ملزم",
          "التزام",
          "دفعه مقدمه",
          "شراء",
          "ملزمني"
        ],
        "questionEn": "What is a reservation, exactly?",
        "questionAr": "يعني شنو الحجز بالضبط؟",
        "answerEn": "A name on a list, not a purchase. It is not a payment, not an order, and not a promise of a date. What it does mean: when a batch is ready, you are told first, with the price and the details, and then you decide. You are holding a place, not signing anything.",
        "answerAr": "اسمك بالقائمة، مب عملية شراء. مب دفع، ولا طلب، ولا وعد بتاريخ. واللي يعنيه فعلاً: أول ما تجهز الدفعة توصلك إنت أول واحد، بالسعر والتفاصيل، وبعدين تقرر. إنت حاجز مكانك، مب موقّع على شي."
      },
      {
        "id": "reservation-change",
        "keywordsEn": [
          "change my reservation",
          "cancel",
          "edit my",
          "modify",
          "wrong colour",
          "wrong color",
          "wrong engraving",
          "made a mistake",
          "update my reservation",
          "typo"
        ],
        "keywordsAr": [
          "الغي",
          "الغاء",
          "اعدل",
          "تعديل",
          "تغيير",
          "غلط",
          "ابدل اللون",
          "خطا املائي"
        ],
        "questionEn": "Can I change or cancel my reservation?",
        "questionAr": "أقدر أعدل أو ألغي حجزي؟",
        "answerEn": "Both, and you do not have to ask anyone's permission. Sign in, open your reservation, and change the colour or the engraving, or cancel it outright from the same place. Nothing has been paid, so there is nothing to refund. One thing to watch: fix the engraving before the batch is cut, because steel does not take edits.",
        "answerAr": "الاثنين، وبدون ما تستأذن أحد. سجّل دخول، افتح حجزك، وغيّر اللون أو النقش، أو ألغه كامل من نفس المكان. ما في شي مدفوع، يعني ما في شي يرجع لك. وشي واحد بس دير بالك عليه: عدّل النقش قبل لا تنحفر الدفعة، لأن الستيل ما يقبل تعديل."
      },
      {
        "id": "sign-in",
        "keywordsEn": [
          "sign in",
          "log in",
          "login",
          "my account",
          "cannot get in",
          "create account",
          "register",
          "account page",
          "it says my details are wrong"
        ],
        "keywordsAr": [
          "تسجيل الدخول",
          "دخول",
          "حساب",
          "ما اقدر ادخل",
          "اسجل",
          "انشاء حساب",
          "بياناتي غلط"
        ],
        "questionEn": "How do I sign in?",
        "questionAr": "شلون أسجل دخول؟",
        "answerEn": "Email and password on the sign in page. One thing worth knowing before you get annoyed: log in and create account are two separate things on that panel, and they look similar. If it tells you your details are wrong and you are certain they are not, check you are on the right one of the two before you reset anything.",
        "answerAr": "إيميل وباسورد بصفحة تسجيل الدخول. وشي يستاهل تعرفه قبل لا تتضايق: \"تسجيل الدخول\" و\"إنشاء حساب\" شيئين منفصلين بنفس اللوحة وشكلهم متقارب. فإذا طلع لك إن بياناتك غلط وإنت متأكد إنها صح، تأكد إنك على الزر الصح من الثنين قبل لا تعيد تعيين أي شي."
      },
      {
        "id": "password",
        "keywordsEn": [
          "password",
          "forgot my password",
          "reset",
          "cannot remember",
          "locked out",
          "passcode",
          "new password"
        ],
        "keywordsAr": [
          "باسورد",
          "كلمه السر",
          "الرمز السري",
          "نسيت",
          "استعاده",
          "اعاده تعيين",
          "باسورد يديد"
        ],
        "questionEn": "I forgot my password",
        "questionAr": "نسيت الباسورد",
        "answerEn": "Use the reset link on the sign in page. It sends a link to your email; open it and set a new password. We cannot see your old one and we cannot read it back to you — nobody here can, and that is deliberate rather than unhelpful.",
        "answerAr": "استخدم رابط إعادة التعيين بصفحة الدخول. بيوصلك رابط على إيميلك، تفتحه وتحط باسورد يديد. واحنا ما نشوف باسوردك القديم ولا نقدر نقوله لك — ولا أحد عندنا يقدر، وهذا عن قصد مب تقصير."
      },
      {
        "id": "email-confirmation",
        "keywordsEn": [
          "confirmation email",
          "confirm my email",
          "verify",
          "verification",
          "did not get the email",
          "no email",
          "spam",
          "junk",
          "inbox",
          "activate my account",
          "resend"
        ],
        "keywordsAr": [
          "ايميل التاكيد",
          "تاكيد",
          "ما وصلني",
          "التفعيل",
          "سبام",
          "جنك",
          "بريد",
          "اعاده ارسال"
        ],
        "questionEn": "I did not get the confirmation email",
        "questionAr": "ما وصلني إيميل التأكيد",
        "answerEn": "It goes out the moment the account is created, and it lands in junk more often than anyone would like — look there first. Your account exists either way; it is simply waiting to be confirmed before a reservation can be attached to it. If it genuinely is not there after a proper look, write to us through the contact link and it gets sent again.",
        "answerAr": "يطلع أول ما ينسوّى الحساب، ويطيح بالـ Junk أكثر مما نتمنى — دوّر فيه أول شي. وحسابك موجود على كل حال، بس ينتظر التأكيد قبل ما ينربط فيه حجز. وإذا فعلاً مب موجود بعد ما دورت عدل، راسلنا من رابط التواصل ونعيد إرساله."
      },
      {
        "id": "delivery",
        "keywordsEn": [
          "deliver",
          "delivery",
          "shipping",
          "ship",
          "when will it",
          "arrive",
          "courier",
          "dispatch",
          "eta",
          "how long until",
          "post"
        ],
        "keywordsAr": [
          "توصيل",
          "شحن",
          "متى يوصل",
          "يوصل",
          "الطلبيه",
          "مندوب",
          "متى بيي",
          "كم ياخذ"
        ],
        "questionEn": "When will it be delivered?",
        "questionAr": "متى يوصل؟",
        "answerEn": "No delivery time is published, and I am not going to invent one to make this answer feel better. Nothing goes out until a batch is finished, and a date announced early and then missed costs more trust than saying this does. What you can do: reserve now — it costs nothing, you are not committed, and the delivery details reach you with the batch.",
        "answerAr": "ما في وقت توصيل منشور، وما بأخترع واحد عشان يصير الجواب أحلى. ما يطلع شي قبل لا تخلص الدفعة، وتاريخ ننشره بدري وبعدين نكسره يضيّع ثقة أكثر من هالكلام. واللي تقدر تسويه: احجز الحين — ببلاش، وإنت مب ملتزم بشي، وتفاصيل التوصيل توصلك مع الدفعة."
      },
      {
        "id": "warranty",
        "keywordsEn": [
          "warranty",
          "guarantee",
          "broken",
          "broke",
          "defect",
          "faulty",
          "return it",
          "refund",
          "replace",
          "damaged",
          "dented"
        ],
        "keywordsAr": [
          "ضمان",
          "مكسور",
          "انكسر",
          "عيب",
          "خربان",
          "ارجاع",
          "استبدال",
          "تلف",
          "معطوب"
        ],
        "questionEn": "Is there a warranty?",
        "questionAr": "في ضمان؟",
        "answerEn": "No warranty term has been published, so please do not assume one exists — that is an honest gap rather than a no. If something arrives wrong, or breaks in a way it clearly should not have, write to us through the contact link. At this size that is handled by a person reading your message, not by a policy page, and a person can do more than a policy page anyway.",
        "answerAr": "ما في مدة ضمان منشورة، فلا تفترض إن في وحدة — وهذي فجوة نقولها بصراحة، مب \"لا\". وإذا وصلك شي غلط، أو انكسر بطريقة واضح إنها مب مفروض تصير، راسلنا من رابط التواصل. واحنا بهالحجم يتعامل معاها إنسان يقرا رسالتك، مب صفحة سياسات — والإنسان يقدر يسوي أكثر منها على كل حال."
      },
      {
        "id": "contact-human",
        "keywordsEn": [
          "contact",
          "talk to a human",
          "speak to someone",
          "a person",
          "email you",
          "phone",
          "whatsapp",
          "instagram",
          "support",
          "reach you",
          "get in touch"
        ],
        "keywordsAr": [
          "تواصل",
          "اكلم",
          "شخص",
          "انسان",
          "رقم",
          "واتساب",
          "انستقرام",
          "دعم",
          "راسلكم",
          "وين القاكم"
        ],
        "questionEn": "I want to talk to a person",
        "questionAr": "أبي أكلم شخص",
        "answerEn": "Fair enough — I am a script, not a person. Use the contact link on this site; it goes to the person who runs cup.kw, and it is read by a human rather than a queue. Say what you already tried and you will get a shorter, faster reply back.",
        "answerAr": "من حقك — أنا سكربت، مب شخص. استخدم رابط التواصل بالموقع؛ يوصل للشخص اللي يدير cup.kw، ويقراه إنسان مب طابور تذاكر. واكتب شنو سويت قبل، وبتاخذ رد أقصر وأسرع."
      },
      {
        "id": "what-are-you",
        "keywordsEn": [
          "are you real",
          "are you ai",
          "are you a bot",
          "chatgpt",
          "robot",
          "who are you",
          "what are you",
          "assistant",
          "human or",
          "can you think"
        ],
        "keywordsAr": [
          "ذكاء اصطناعي",
          "انت شنو",
          "بوت",
          "روبوت",
          "منو انت",
          "حقيقي",
          "برنامج",
          "تفكر"
        ],
        "questionEn": "Are you a real assistant?",
        "questionAr": "إنت مساعد حقيقي؟",
        "answerEn": "No. I am a small script with a list of answers written out by hand, matched against the words you type. There is no model behind me, I learn nothing from you, and nothing you type is sent anywhere. When your question is not on the list I will say so, because a made-up answer from something like me is worse than no answer at all.",
        "answerAr": "لا. أنا سكربت صغير، عندي قائمة أجوبة مكتوبة باليد، وأقارنها بالكلمات اللي تكتبها. ما وراي أي نموذج، وما أتعلم منك شي، وما يترسل شي تكتبه لأي مكان. وإذا سؤالك مب بالقائمة بقول لك، لأن جواب مخترع من شي مثلي أسوأ من لا جواب أصلاً."
      }
    ]
  },
  /* THE QUESTS — four places the cup turns up, on the way to the spec.

     The captions are written as messages rather than as marketing, because
     that is the register the photographs are already in: somebody's hand,
     somebody's evening, somebody's name on the cup. Each one is a different
     colourway with a different name cut into it, which is the whole
     positioning demonstrated without a word of copy. */
  "quests": [
    {
      "src": "assets/img/quest-majlis.jpg",
      "altEn": "The brown cup held in a majlis, engraved AHMAD, a television and lit shelves of dallah pots behind it",
      "altAr": "الكوب البني بيد في ديوانية، محفور عليه AHMAD، وخلفه تلفزيون ورفوف دلال مضويّة",
      "capEn": "the diwaniya starts at nine. brought my own.",
      "capAr": "الدوانية تبدأ التسعة. جبت كوبي وياي."
    },
    {
      "src": "assets/img/quest-balcony.jpg",
      "altEn": "The green cup held on a balcony at night, engraved MAJED, a laptop of code and lit towers behind it",
      "altAr": "الكوب الأخضر بيد على بلكونة بالليل، محفور عليه MAJED، وخلفه لابتوب فيه كود وأبراج مضويّة",
      "capEn": "main quest: finish it before the sun comes up.",
      "capAr": "المهمة الأساسية: نخلّصه قبل ما تطلع الشمس."
    },
    {
      "src": "assets/img/quest-poolside.jpg",
      "altEn": "The Butter Yellow cup held on a stone table beside a swimming pool, engraved WAHAJ",
      "altAr": "الكوب الأصفر بيد على طاولة حجر جنب المسبح، محفور عليه WAHAJ",
      "capEn": "side quest: do absolutely nothing, but cold.",
      "capAr": "مهمة جانبية: ما أسوي ولا شي، بس بارد."
    },
    {
      "src": "assets/img/quest-pilates.jpg",
      "altEn": "The Baby Pink cup held in a pilates studio, engraved ASMAA, full of iced matcha with its lid off beside it",
      "altAr": "الكوب الوردي بيد في ستوديو بيلاتس، محفور عليه ASMAA، معبّى ماتشا مثلجة وغطاه جنبه",
      "capEn": "reformer at seven. the matcha made it.",
      "capAr": "بيلاتس السابعة. والماتشا نجت."
    }
  ],

  "gallery": [
    {
      "src": "assets/img/in-hand.jpg",
      "altEn": "The cup held in one hand against a plain background, showing its size",
      "altAr": "الكوب بيد وحدة على خلفية بيضاء، وباين حجمه",
      "capEn": "",
      "capAr": ""
    },
    {
      "src": "assets/img/in-car.jpg",
      "altEn": "The cup standing in a car cup holder, a hand resting on it",
      "altAr": "الكوب واقف بحامل أكواب السيارة، ويد ماسكته",
      "capEn": "",
      "capAr": ""
    },
    {
      "src": "assets/img/at-desk.jpg",
      "altEn": "The cup held at a desk in front of two screens showing code",
      "altAr": "الكوب بيد قدام شاشتين عليهم كود، على مكتب",
      "capEn": "Where most of them actually live.",
      "capAr": "المكان اللي يعيش فيه أغلبها فعلاً."
    },
    {
      "src": "assets/img/poolside.jpg",
      "altEn": "A hand lifting the cup off a concrete table beside a pool in full sun",
      "altAr": "يد ترفع الكوب من طاولة خرسانية جنب المسبح والشمس طالعة",
      "capEn": "Outside, in the sun, unbothered.",
      "capAr": "برا، بالشمس، وما همه."
    },
    {
      "src": "assets/img/cold-drink.jpg",
      "altEn": "The cup with its lid off beside it, filled with an iced drink and a steel straw",
      "altAr": "الكوب وغطاه مشلوع جنبه، ومعبّى شراب بارد وفيه مصاصة ستيل",
      "capEn": "Lid off. Straw in.",
      "capAr": "الغطا مشلوع، والمصاصة داخل."
    }
  ]
};
