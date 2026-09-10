/* THE CATALOGUE — every item, and what is true about it.

   Kept beside content.js rather than inside it for the same reason experience.js
   is separate: content.js is the file someone edits to correct a fact about THE
   cup, and burying forty products in it would make that file unreadable. The
   rule it inherits is the same one — nothing here is invented on the page. A
   product with no price does not render an empty box, it says so.

   PROVENANCE, so the next person knows what to trust:
   - Bodies, dimensions and capacities come off the 3D model sheets and the
     Stanley-style spec sheet in the design pack.
   - Colour names, English and Arabic, are transcribed from the colour sheets.
   - Hexes are sampled from those sheets and are approximations of a render, not
     Pantone references. Correct them against a physical cup when one exists.
   - Prices: 7.500 (Classic), 8.500 (Sadu) and 8.000 (Transparent) are the
     figures on the app mockup. 9.000 (Concept) and 9.500 (Advanced) are NOT on
     any sheet — they were set to complete the ladder, Advanced highest because
     it is the 887 ml body with the handle and the 2-in-1 lid, Concept above the
     limited edition because every panel is printed. Replace both with real
     numbers when there are any. A line set back to null renders "not set yet"
     rather than a plausible invention.

   Concept Editions are unlicensed studio concepts made for a class pitch. They
   are not affiliated with, endorsed by, or produced under licence from any
   rights holder, and the page says so. Keep that line if these ship anywhere.  */

window.CUP_CATALOGUE = {

  /* The two bodies everything is built on. */
  bodies: {
    classic:  { heightCm: 22, diameterCm: 7,  capacityMl: 650, handle: false },
    advanced: { heightCm: 24, topDiameterCm: 10, baseDiameterCm: 7.5, capacityMl: 887, handle: true }
  },

  lines: [
    {
      slug: 'classic',
      en: 'Classic', ar: 'الأساسي',
      blurbEn: 'The everyday cup. Straw, lid, steel, and fifteen ways to not lose it.',
      blurbAr: 'كوب كل يوم. شفاطة وغطا وستيل، وخمستعشر لون ما تضيّعه بينهم.',
      body: 'classic', priceKwd: 7.500,
      features: ['straw', 'insulated', 'bpafree'],
      items: [
        { slug: 'pink',          en: 'Pink',          ar: 'وردي',       hex: '#C98A93' },
        { slug: 'red',           en: 'Red',           ar: 'أحمر',        hex: '#8E2230' },
        { slug: 'light-blue',    en: 'Light Blue',    ar: 'أزرق فاتح',  hex: '#8FB4CE' },
        { slug: 'navy',          en: 'Navy',          ar: 'كحلي',        hex: '#16233D' },
        { slug: 'black',         en: 'Black',         ar: 'أسود',        hex: '#1B1B1D' },
        { slug: 'white',         en: 'White',         ar: 'أبيض',        hex: '#EFEAE0' },
        { slug: 'orange',        en: 'Orange',        ar: 'برتقالي',     hex: '#D2622A' },
        { slug: 'yellow',        en: 'Yellow',        ar: 'أصفر',        hex: '#E0B02A' },
        { slug: 'green',         en: 'Green',         ar: 'أخضر',        hex: '#4F5A38' },
        { slug: 'beige',         en: 'Beige',         ar: 'بيج',         hex: '#C7B49A' },
        { slug: 'baby-pink',     en: 'Baby Pink',     ar: 'بيبي بينك',  hex: '#E8A0A8' },
        { slug: 'brown',         en: 'Brown',         ar: 'بني',         hex: '#6B4A35' },
        { slug: 'purple',        en: 'Purple',        ar: 'بنفسجي',      hex: '#7B3F98' },
        { slug: 'baby-blue',     en: 'Baby Blue',     ar: 'بيبي بلو',   hex: '#A8C8E4' },
        { slug: 'butter-yellow', en: 'Butter Yellow', ar: 'بتر يلو',    hex: '#F0DC82' }
      ]
    },

    {
      slug: 'sadu',
      en: 'Limited Edition · Sadu', ar: 'إصدار محدود · السدو',
      blurbEn: 'The same cup with a woven band around it. Tradition meets modern use.',
      blurbAr: 'نفس الكوب وحوله نقش السدو. تراثٌ يرافقك كل يوم.',
      body: 'classic', priceKwd: 8.500, band: true,
      features: ['straw', 'insulated', 'bpafree', 'limited'],
      items: [
        { slug: 'beige-sand',    en: 'Beige Sand',    ar: 'رملي فاتح',  hex: '#D8C9AE' },
        { slug: 'sadu-burgundy', en: 'Sadu Burgundy', ar: 'عنّابي السدو', hex: '#8C1D24' },
        { slug: 'olive-khaki',   en: 'Olive Khaki',   ar: 'زيتي',        hex: '#5C6544' },
        { slug: 'terracotta',    en: 'Terracotta',    ar: 'طيني',        hex: '#B0603A' },
        { slug: 'navy',          en: 'Navy',          ar: 'كحلي',        hex: '#16233D' },
        { slug: 'charcoal',      en: 'Charcoal',      ar: 'فحمي',        hex: '#3B3A3A' },
        { slug: 'rosewood',      en: 'Rosewood',      ar: 'خشب الورد',  hex: '#9C6A6B' },
        { slug: 'sage',          en: 'Sage',          ar: 'مريمية',      hex: '#A9B69C' },
        { slug: 'slate-blue',    en: 'Slate Blue',    ar: 'أزرق حجري',  hex: '#90A9C2' },
        { slug: 'cream',         en: 'Cream',         ar: 'كريمي',       hex: '#EFE6D6' },
        { slug: 'sand-brown',    en: 'Sand Brown',    ar: 'بني رملي',   hex: '#7B6350' },
        { slug: 'dusty-pink',    en: 'Dusty Pink',    ar: 'وردي هادي',  hex: '#DFC0BB' },
        { slug: 'matte-black',   en: 'Matte Black',   ar: 'أسود مطفي',  hex: '#1B1B1D' },
        { slug: 'mustard',       en: 'Mustard',       ar: 'خردلي',       hex: '#D5A02E' }
      ]
    },

    {
      slug: 'advanced',
      en: 'Advanced · Handle', ar: 'المتقدّم · بمقبض',
      blurbEn: '887 ml, a 2-in-1 lid for hot or cold, and a handle that folds flush.',
      blurbAr: '٨٨٧ مل، غطا ٢×١ للحار والبارد، ومقبض ينطوي مع الجسم.',
      body: 'advanced', priceKwd: 9.500,
      features: ['straw', 'lid2in1', 'handle', 'insulated', 'bpafree'],
      items: [
        { slug: 'navy-blueprint',  en: 'Navy Blueprint',  ar: 'مخطط كحلي', hex: '#16233D', ink: '#F2EAD8' },
        { slug: 'white-blueprint', en: 'White Blueprint', ar: 'مخطط أبيض', hex: '#F2EAD8', ink: '#16233D' },
        { slug: 'cyber-green',     en: 'Cybersecurity',   ar: 'الأمن السيبراني', hex: '#12140F', ink: '#4ADE80' }
      ]
    },

    {
      slug: 'concept',
      en: 'Concept Editions', ar: 'إصدارات المفهوم',
      blurbEn: 'Studio concepts, printed end to end. Different worlds, same great drinks.',
      blurbAr: 'أفكار من الاستوديو، مطبوعة من فوق لتحت. عوالم مختلفة، ونفس المشروب.',
      body: 'classic', priceKwd: 9.000, concept: true,
      features: ['straw', 'insulated', 'bpafree'],
      items: [
        { slug: 'cyber-navy',   en: 'Cybersecurity', ar: 'الأمن السيبراني', hex: '#F2EAD8', ink: '#16233D' },
        { slug: 'harry-potter', en: 'Harry Potter',  ar: 'هاري بوتر',       hex: '#C9A87C', ink: '#5B3A1E', clear: true },
        { slug: 'interstellar', en: 'Interstellar',  ar: 'بين النجوم',      hex: '#1A1A22', ink: '#C9D4E8', clear: true }
      ]
    },

    {
      slug: 'clear',
      en: 'Transparent', ar: 'الشفّاف',
      blurbEn: 'No print, no colour, nothing on it at all. You see the drink, and that is the point.',
      blurbAr: 'بدون طباعة وبدون لون، ولا شي عليه. تشوف مشروبك، وهذي الفكرة.',
      body: 'classic', priceKwd: 8.000,
      features: ['straw', 'bpafree'],
      items: [
        /* Clear means clear. This carries no colour at all — no print, no tint,
           and nothing in it. `hex` is the glass rather than a drink, and `bare`
           keeps both the printed field and the contents off it. */
        { slug: 'matcha-clear', en: 'Clear', ar: 'شفاف', hex: '#DCE3E8', clear: true, bare: true }
      ]
    }
  ],

  /* THE COLLECTIONS — the four buttons at the top of the menu.

     Two of these are honest and two are not yet.

     `all` is every cup, and `limited` is derived: it asks the line for the
     `limited` feature it already carries, so the Sadu line answers because it
     IS a limited edition and not because anyone tagged it here. Correct the
     feature and this button follows.

     `new` and `best` are PLACEHOLDER. There is no release date on anything in
     this file and no sales data anywhere in this repository, so membership is a
     hand-picked editorial guess for the pitch — the same standing as the two
     invented prices above and the demo contact handles in content.js. Both are
     marked `placeholder: true`, which puts a line on the page saying so
     whenever one of them is the active filter. Replace the ids with real ones
     and drop that flag; a "best seller" that is really a favourite is exactly
     the kind of claim the README forbids.

     Ids are `line/item`, the same key the cart stores, so a cup renamed in
     `items` above has to be renamed here too or it silently leaves the
     collection. */
  collections: [
    { slug: 'all', key: 'coll.all' },

    { slug: 'new', key: 'coll.new', placeholder: true, ids: [
      'concept/cyber-navy', 'concept/harry-potter', 'concept/interstellar',
      'clear/matcha-clear', 'classic/butter-yellow', 'classic/baby-blue'
    ] },

    { slug: 'limited', key: 'coll.limited', feature: 'limited' },

    { slug: 'best', key: 'coll.best', placeholder: true, ids: [
      'classic/navy', 'classic/black', 'classic/beige',
      'sadu/beige-sand', 'sadu/sadu-burgundy', 'advanced/navy-blueprint'
    ] }
  ]
};
