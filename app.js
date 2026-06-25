/* ═══════════════════════════════════════════════════════════════════════════
   app.js  —  Biz Anlatırız  |  Ortak Blog & Deneyim Platformu
   Vanilla JS (ES6+) + LocalStorage
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

// ─── Constants ───────────────────────────────────────────────────────────────
const LS_KEY = 'antigravity_blog_data_v2';

// ─── Page Definitions ─────────────────────────────────────────────────────────
const PAGES = {
  mutfak: {
    key:      'mutfak',
    title:    'Mutfaktan Esintiler',
    subtitle: 'Tarifler, püf noktaları ve lezzetli keşifler 🍳',
    emoji:    '🍳',
    theme:    'sage',
    btnClass: 'btn-primary-sage',
    accent:   '#3A7A5A',
  },
  gunluk: {
    key:      'gunluk',
    title:    'Günlük Seyir Defteri',
    subtitle: 'Hayattan kesitler, özel anlar ve paylaşılası deneyimler 📔',
    emoji:    '📔',
    theme:    'peach',
    btnClass: 'btn-primary-peach',
    accent:   '#E07A30',
  },
  teknoloji: {
    key:      'teknoloji',
    title:    'Teknoloji & İnceleme',
    subtitle: 'Elektronik ürünler, incelemeler ve tekno haberler 💻',
    emoji:    '💻',
    theme:    'blue',
    btnClass: 'btn-primary-blue',
    accent:   '#2563EB',
  },
  gezi: {
    key:      'gezi',
    title:    'Gezi Rehberi & Rotalar',
    subtitle: 'Seyahat notları, rotalar ve gidilecek yerler listesi 🧭',
    emoji:    '🧭',
    theme:    'lila',
    btnClass: 'btn-primary-lila',
    accent:   '#8B3CF7',
  },
  okumuyorlar: {
    key:      'okumuyorlar',
    title:    'Okumuyorlar Abi, Düşünmüyorlar',
    subtitle: 'Kitap önerileri, incelemeler ve düşünceler 📚',
    emoji:    '📚',
    theme:    'sage', /* Or maybe peach, let's use peach as it fits well. But maybe 'sage' again? Let's use blue */
    btnClass: 'btn-primary-blue',
    accent:   '#059669', /* Deep teal/greenish */
  },
  dizi_film: {
    key:      'dizi_film',
    title:    'Dizi & Film',
    subtitle: 'Film ve dizi incelemeleri, öneriler ve tartışmalar 🎬',
    emoji:    '🎬',
    theme:    'peach',
    btnClass: 'btn-primary-peach',
    accent:   '#E07A30', 
  },
  satin_alma: {
    key:      'satin_alma',
    title:    'Satın Alma Rehberi',
    subtitle: 'Fiyat/performans ürünler, ekipmanlar ve tavsiyeler 🛒',
    emoji:    '🛒',
    theme:    'blue',
    btnClass: 'btn-primary-blue',
    accent:   '#2563EB', 
  },
};

// ─── Besin Veritabanı (per 100g: cal, protein, carbs, fat) ──────────────────────
// units: { birim: gram_karşılığı } — o besin için özel birimlerin gram karşılığı
const FOOD_DB = [
  // Etler & Deniz Ürünleri
  { names: ['tavuk göğsü','tavuk gogus','tavuk göğüsü','chicken breast','bonfile tavuk','tavuk bonfile'], cal:165, p:31.0, c:0.0, f:3.6, units:{} },
  { names: ['tavuk but','tavuk bacak','chicken thigh'], cal:209, p:26.0, c:0.0, f:11.0, units:{} },
  { names: ['tavuk','chicken'], cal:180, p:27.0, c:0.0, f:7.0, units:{} },
  { names: ['kıyma','dana kıyma','kuzu kıyma','beef mince','mince'], cal:250, p:26.0, c:0.0, f:17.0, units:{} },
  { names: ['biftek','bonfile','dana eti','antrikot','steak'], cal:271, p:26.0, c:0.0, f:18.0, units:{} },
  { names: ['somon','salmon'], cal:208, p:20.0, c:0.0, f:13.0, units:{} },
  { names: ['ton balığı','tuna','sardalye'], cal:116, p:26.0, c:0.0, f:1.0, units:{} },
  { names: ['karides','shrimp','prawn'], cal:85, p:18.0, c:0.8, f:0.9, units:{} },
  { names: ['yumurta','egg','yumurtalar'], cal:155, p:13.0, c:1.1, f:11.0, units:{adet:60} },
  { names: ['sucuk'], cal:400, p:20.0, c:2.0, f:35.0, units:{dilim:20} },
  { names: ['pastırma'], cal:312, p:34.0, c:0.0, f:20.0, units:{dilim:15} },
  { names: ['salam','sösıs','sosis'], cal:310, p:14.0, c:2.0, f:28.0, units:{dilim:20,adet:50} },
  // Tahıllar
  { names: ['pirinç','rice','beyaz pirinç'], cal:360, p:7.0, c:80.0, f:0.7, units:{'su bardağı':185,'bardak':185} },
  { names: ['makarna','pasta','spagetti','penne','linguine','fusilli'], cal:370, p:13.0, c:73.0, f:1.5, units:{} },
  { names: ['ekmek','beyaz ekmek','bread'], cal:265, p:9.0, c:49.0, f:3.2, units:{dilim:30,adet:30} },
  { names: ['tam buğday ekmeği','tam tahıl ekmek','köy ekmeği'], cal:247, p:13.0, c:41.0, f:4.0, units:{dilim:30} },
  { names: ['un','buğday unu','flour'], cal:364, p:10.0, c:76.0, f:1.0, units:{'su bardağı':120,'bardak':120,'yemek kaşığı':8,'yemek kasigi':8} },
  { names: ['yulaf','yulaf ezmesi','oat','oatmeal'], cal:389, p:17.0, c:66.0, f:7.0, units:{'su bardağı':80} },
  { names: ['bulgur'], cal:342, p:12.0, c:76.0, f:1.0, units:{'su bardağı':180} },
  { names: ['nişasta','mısır nişastası','starch','cornstarch'], cal:381, p:0.3, c:91.0, f:0.1, units:{'yemek kaşığı':8} },
  { names: ['pitta','pıta','tortilla','lavash','lavaş','dürüm'], cal:290, p:9.0, c:58.0, f:3.0, units:{adet:60} },
  // Süt Ürünleri
  { names: ['süt','milk','tam yağlı süt'], cal:61, p:3.2, c:4.8, f:3.3, units:{'su bardağı':240,'bardak':240,'çay bardağı':120} },
  { names: ['yoğurt','yogurt','süzme yoğurt'], cal:59, p:3.5, c:4.7, f:3.3, units:{kase:200,'su bardağı':240,'çay bardağı':120} },
  { names: ['peynir','beyaz peynir','kasar','kaşar','kasar peynir'], cal:280, p:18.0, c:2.0, f:22.0, units:{dilim:30} },
  { names: ['tereyağı','tereyağ','butter'], cal:717, p:0.9, c:0.1, f:81.0, units:{'yemek kaşığı':14,'tatlı kaşığı':5} },
  { names: ['krema','heavy cream','kaymak'], cal:340, p:2.8, c:3.0, f:36.0, units:{'yemek kaşığı':15} },
  { names: ['lor peyniri','ricotta','cottage'], cal:174, p:11.0, c:3.0, f:13.0, units:{} },
  { names: ['labne'], cal:150, p:8.0, c:4.0, f:11.0, units:{'yemek kaşığı':20} },
  { names: ['kefir'], cal:41, p:3.5, c:4.5, f:1.0, units:{'su bardağı':240} },
  // Sebzeler
  { names: ['domates','tomato','domates suyu'], cal:18, p:0.9, c:3.9, f:0.2, units:{adet:120} },
  { names: ['biber','kırmızı biber','yeşil biber','sivri biber','kapya','dolmalık biber','bell pepper'], cal:31, p:1.0, c:6.0, f:0.3, units:{adet:120} },
  { names: ['soğan','kuru soğan','onion'], cal:40, p:1.1, c:9.3, f:0.1, units:{adet:110} },
  { names: ['sarımsak','garlic','sarimsak'], cal:149, p:6.4, c:33.0, f:0.5, units:{diş:4,adet:4} },
  { names: ['patates','potato','patates püre'], cal:77, p:2.0, c:17.0, f:0.1, units:{adet:150} },
  { names: ['havuç','carrot','havuç'], cal:41, p:0.9, c:10.0, f:0.2, units:{adet:80} },
  { names: ['ıspanak','spinach'], cal:23, p:2.9, c:3.6, f:0.4, units:{demet:150} },
  { names: ['patlıcan','eggplant','aubergine'], cal:25, p:1.0, c:6.0, f:0.2, units:{adet:200} },
  { names: ['kabak','zucchini','courgette','kabak biber'], cal:17, p:1.2, c:3.1, f:0.3, units:{adet:150} },
  { names: ['mantar','mushroom','champignon','kültür mantarı'], cal:22, p:3.1, c:3.3, f:0.3, units:{adet:15} },
  { names: ['mısır','corn','mısır konservesi'], cal:86, p:3.3, c:19.0, f:1.4, units:{} },
  { names: ['bezelye','peas'], cal:81, p:5.4, c:14.0, f:0.4, units:{} },
  { names: ['brokoli','broccoli'], cal:34, p:2.8, c:7.0, f:0.4, units:{} },
  { names: ['karnabahar','cauliflower'], cal:25, p:1.9, c:5.0, f:0.3, units:{} },
  { names: ['lahana','cabbage'], cal:25, p:1.3, c:5.8, f:0.1, units:{} },
  { names: ['pırasa','leek'], cal:61, p:1.5, c:14.0, f:0.3, units:{} },
  { names: ['kereviz','celery'], cal:16, p:0.7, c:3.0, f:0.2, units:{} },
  { names: ['salatalık','cucumber','hiyar'], cal:15, p:0.7, c:3.6, f:0.1, units:{adet:200} },
  { names: ['domates salçası','salça','biber salçası','tomato paste'], cal:82, p:4.5, c:16.0, f:0.5, units:{'yemek kaşığı':16} },
  // Meyveler
  { names: ['limon','lemon'], cal:29, p:1.1, c:9.0, f:0.3, units:{adet:80} },
  { names: ['portakal','orange'], cal:47, p:0.9, c:12.0, f:0.1, units:{adet:150} },
  { names: ['elma','apple'], cal:52, p:0.3, c:14.0, f:0.2, units:{adet:150} },
  { names: ['muz','banana'], cal:89, p:1.1, c:23.0, f:0.3, units:{adet:120} },
  { names: ['çilek','strawberry'], cal:32, p:0.7, c:7.7, f:0.3, units:{adet:12} },
  { names: ['nar','pomegranate'], cal:83, p:1.7, c:19.0, f:1.2, units:{adet:200} },
  // Yağlar
  { names: ['zeytinyağı','olive oil','zeytin yağı'], cal:884, p:0.0, c:0.0, f:100.0, units:{'yemek kaşığı':14,'tatlı kaşığı':5} },
  { names: ['sıvı yağ','ayçiçek yağı','bitkisel yağ','sunflower oil','mısır yağı'], cal:884, p:0.0, c:0.0, f:100.0, units:{'yemek kaşığı':14,'tatlı kaşığı':5} },
  { names: ['susam yağı','sesame oil'], cal:884, p:0.0, c:0.0, f:100.0, units:{'yemek kaşığı':14} },
  // Kurubaklagiller
  { names: ['mercimek','kırmızı mercimek','yeşil mercimek','lentil'], cal:353, p:25.0, c:60.0, f:1.1, units:{'su bardağı':200} },
  { names: ['nohut','chickpea'], cal:364, p:19.0, c:61.0, f:6.0, units:{'su bardağı':200} },
  { names: ['kuru fasulye','fasulye','bean','barbunya'], cal:337, p:23.0, c:61.0, f:1.0, units:{'su bardağı':200} },
  // Kuruyemişler
  { names: ['ceviz','walnut'], cal:654, p:15.0, c:14.0, f:65.0, units:{adet:4} },
  { names: ['badem','almond'], cal:579, p:21.0, c:22.0, f:50.0, units:{adet:1} },
  { names: ['fındık','hazelnut'], cal:628, p:15.0, c:17.0, f:61.0, units:{adet:1} },
  { names: ['susam','sesame'], cal:573, p:18.0, c:23.0, f:50.0, units:{'yemek kaşığı':9} },
  { names: ['çam fıstığı','pine nut'], cal:673, p:14.0, c:13.0, f:68.0, units:{} },
  { names: ['yer fıstığı','peanut'], cal:567, p:26.0, c:16.0, f:49.0, units:{} },
  // Tatlandırıcı & Diğer
  { names: ['şeker','toz şeker','granulated sugar','sugar'], cal:387, p:0.0, c:100.0, f:0.0, units:{'yemek kaşığı':12,'tatlı kaşığı':4} },
  { names: ['bal','honey'], cal:304, p:0.3, c:82.0, f:0.0, units:{'yemek kaşığı':21,'tatlı kaşığı':7} },
  { names: ['ketçap','ketchup'], cal:112, p:1.7, c:27.0, f:0.1, units:{'yemek kaşığı':17} },
  { names: ['mayonez','mayonnaise'], cal:680, p:1.0, c:0.6, f:75.0, units:{'yemek kaşığı':14} },
  { names: ['soya sosu','soy sauce'], cal:53, p:8.0, c:5.0, f:0.6, units:{'yemek kaşığı':15} },
  { names: ['hardal','mustard'], cal:66, p:4.4, c:6.0, f:3.6, units:{'yemek kaşığı':15} },
];

// ─── Birim → Gram Çevirici ────────────────────────────────────────────────────────────
const UNIT_TO_GRAMS = {
  'g':1, 'gr':1, 'gram':1, 'grams':1,
  'ml':1, 'cc':1,
  'kg':1000,
  'l':1000, 'lt':1000, 'litre':1000,
  'dilim':30,
  'diş':4,
  'yemek kaşığı':15, 'yemek kasigi':15, 'y.k.':15, 'yk':15,
  'çorba kaşığı':15, 'corba kasigi':15, 'ç.k.':15,
  'tatlı kaşığı':5,  'tatli kasigi':5, 't.k.':5, 'tk':5, 'tatlı kasığı':5,
  'su bardağı':200, 'su bardagi':200, 'bardak':200, 's.b.':200,
  'çay bardağı':100, 'cay bardagi':100, 'ç.b.':100,
  'kase':250, 'bowl':250,
  'porsiyon':150, 'serving':150,
  'avuç':30,
  'demet':100,
  'dal':20,
  'paket':100,
  'kutu':400, 'teneke':400, 'can':400,
  'adet':100, 'tane':100, 'piece':100,
};

// ─── Application State ────────────────────────────────────────────────────────
let state = {
  activePage:     null,   // 'mutfak' | 'gunluk' | 'teknoloji' | 'gezi'
  activeCatId:    null,   // category id string
  activeTopicId:  null,   // topic id string
  editingTopicId: null,   // topic being edited
};

// ─── Data Store ───────────────────────────────────────────────────────────────
let db = {};

// ─── Mock Data ────────────────────────────────────────────────────────────────
function getMockData() {
  return {
    mutfak: {
      categories: [
        {
          id: 'cat-mutfak-1',
          name: 'Pratik Hamur İşleri',
          desc: 'Hızlı, kolay ve lezzetli hamur tarifleri',
          topics: [
            {
              id: 'topic-mutfak-1',
              title: '3 Malzemeli Kolay Poğaça',
              content: `Malzemeler:\n• 1 su bardağı yoğurt\n• 1 su bardağı sıvı yağ\n• 3 su bardağı un (azar azar ekleyin)\n• 1 paket kabartma tozu\n• Tuz\n• İç için: beyaz peynir veya patates\n\nYapılışı:\nYoğurt, sıvı yağ ve tuzu karıştırın. Kabartma tozunu una ekleyip yavaş yavaş ilave edin. Yumuşak bir hamur elde edin. Ceviz büyüklüğünde parçalar koparıp içine peynir koyun ve kapatın. Üzerine yumurta sarısı ve çörek otu sürün. 180 derecede kızarana kadar pişirin. Afiyet olsun! 😍`,
              links: [
                { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
              ],
              comments: [
                { id: 'comment-m1', author: 'Ece', text: 'Denedim, süper oldu! İçine mısır da koydum 😋', date: '2026-06-10T14:30:00Z' },
                { id: 'comment-m2', author: 'Mert', text: 'Hamur fazla yapışkan oldu bende, un miktarını nasıl ayarladın?', date: '2026-06-11T09:15:00Z' },
              ],
              date: '2026-06-08T10:00:00Z',
            },
            {
              id: 'topic-mutfak-2',
              title: 'Ev Yapımı Pizza Hamuru (İnce Tabanlı)',
              content: `İtalyan pizzacılardan aldığım sırları paylaşıyorum! 🍕\n\nMalzemeler:\n• 500g un\n• 1 paket instant maya\n• 1 çay kaşığı tuz\n• 1 çay kaşığı şeker\n• 3 yemek kaşığı zeytinyağı\n• 300ml ılık su\n\nYapılışı:\nMayayı ılık suda şekerle eritin, 10 dk bekleyin. Unu eleyin, ortasını açıp maya karışımını, zeytinyağını ve tuzu ekleyin. 10 dk yoğurun. 1 saat mayalandırın. İnce açın, fırçalayıp malzemeleri koyun. 220 derecede 12-15 dk pişirin.`,
              links: [
                { url: 'https://www.instagram.com/p/example' },
              ],
              comments: [],
              date: '2026-06-12T16:20:00Z',
            },
          ],
        },
        {
          id: 'cat-mutfak-2',
          name: 'Sağlıklı Tarifler',
          desc: 'Hem lezzetli hem de besleyici seçenekler',
          topics: [
            {
              id: 'topic-mutfak-3',
              title: 'Yeşil Smoothie Bowl',
              content: `Sabahların güzel başlangıcı! 🥗\n\nMalzemeler:\n• 1 muz (dondurulmuş)\n• 2 avuç ıspanak\n• Yarım avokado\n• Hindistancevizi sütü (kıvamlandırmak için)\n\nÜzeri için:\n• Granola, meyve dilimleri, chia tohumu\n\nTüm malzemeleri blenderda pürüzsüz hale getirin. Kaseye dökün, üzerini süsleyin. Sağlıklı ve doyurucu!`,
              links: [],
              comments: [
                { id: 'comment-m3', author: 'Selin', text: 'Her sabah yapıyorum artık, vazgeçemedim!', date: '2026-06-13T08:00:00Z' },
              ],
              date: '2026-06-13T07:30:00Z',
            },
          ],
        },
      ],
    },

    gunluk: {
      categories: [
        {
          id: 'cat-gunluk-1',
          name: 'Hafta Sonu Maceraları',
          desc: 'Hafta sonları yaşanan anlık keyifler',
          topics: [
            {
              id: 'topic-gunluk-1',
              title: 'Boğaz\'da Sabah Koşusu',
              content: `Bugün saat 6\'da kalktım, Boğaz\'a sabah koşusuna gittim. 🌅\n\nHava henüz aydınlanmamıştı ama martılar çoktan kahvaltıdaydı. O saatte orada neredeyse kimse yoktu, sadece ben ve köpekler. Vapurların güneş doğarken su üzerindeki yansıması gerçekten büyüleyiciydi.\n\nBu hafta 3 kez koşmayı başardım! Devam ettikçe güçleniyorum. Herkese öneririm, özellikle İstanbul\'daysa tatilcilere – o saatten sonra kalabalık başlıyor.`,
              links: [
                { url: 'https://www.instagram.com/p/example2' },
              ],
              comments: [
                { id: 'comment-g1', author: 'Ali', text: 'Ben de katılmak istiyorum bir gün!', date: '2026-06-09T12:00:00Z' },
              ],
              date: '2026-06-08T06:30:00Z',
            },
          ],
        },
        {
          id: 'cat-gunluk-2',
          name: 'Kitap & Film Köşesi',
          desc: 'İzlediklerimiz, okuduklarımız',
          topics: [
            {
              id: 'topic-gunluk-2',
              title: '"Bülbülü Öldürmek" - Kitap İnceleme',
              content: `Klasikleri bitirme serim devam ediyor! 📚\n\nHarper Lee\'nin bu zamansız eseri beni derinden etkiledi. Atticus Finch sadece bir kahraman değil, gerçek bir insan modeli. Kitabın güney Amerika\'sı ile bugünü karşılaştırmak insanı hem üzüyor hem umutlandırıyor.\n\nPuan: 9.5/10\nOkuma Süresi: 4 gün\nTavsiye Mi? Kesinlikle! Özellikle hukuk ve insan hakları ilgilenenlere.`,
              links: [],
              comments: [],
              date: '2026-06-11T20:00:00Z',
            },
          ],
        },
      ],
    },

    teknoloji: {
      categories: [
        {
          id: 'cat-tek-1',
          name: 'Kulaklık & Ses Sistemleri',
          desc: 'Hoparlörler, kulaklıklar ve ses ekipmanları',
          topics: [
            {
              id: 'topic-tek-1',
              title: 'Sony WH-1000XM5 Uzun Dönem İnceleme',
              content: `6 aylık kullanımdan sonra dürüst görüşlerimi paylaşıyorum 🎧\n\nArtılar:\n✅ Gürültü engelleme gerçekten inanılmaz. Metro, uçak, kafede çalışmak için ideal.\n✅ Pil ömrü: 30 saat rahat veriyor\n✅ LDAC codec desteği, Android ile kusursuz\n✅ Hafif (250g) ve katlanabilir tasarım\n\nEksiler:\n❌ Fiyat yüksek (yaklaşık 8.000₺)\n❌ Kulak yastıkları ısıtıyor yaz aylarında\n❌ Dokunmatik kontroller bazen yanlış tepki veriyor\n\nSonuç: Yoğun kullanıcılar için en iyi seçeneklerden biri. Değer mi? Evet!`,
              links: [
                { url: 'https://www.youtube.com/watch?v=example_tech1' },
                { url: 'https://www.example.com/sony-inceleme' },
              ],
              comments: [
                { id: 'comment-t1', author: 'Burak', text: 'Ben Bose QC45 kullanıyorum, karşılaştırma yazısı da yazar mısın?', date: '2026-06-10T16:00:00Z' },
              ],
              date: '2026-06-07T14:00:00Z',
            },
          ],
        },
        {
          id: 'cat-tek-2',
          name: 'Telefon Dünyası',
          desc: 'Akıllı telefon incelemeleri ve haberler',
          topics: [
            {
              id: 'topic-tek-2',
              title: 'Pixel 9 Pro vs iPhone 16 — Kamera Karşılaştırması',
              content: `2 hafta boyunca her iki telefonla aynı ortamları fotoğrafladım. İşte sonuçlar 📸\n\nGece Çekimleri: Pixel 9 Pro açık ara önde\nPortre Modu: iPhone daha doğal renk\nVideo Stabizasyon: iPhone kazanıyor\nAI Özellikleri: Pixel\'in Magic Eraser ve Photo Unblur muhteşem\nPil Ömrü: iPhone daha iyi\n\nVerdikt: Fotoğraf öncelikliyse Pixel, genel kullanım ve ekosistem için iPhone.`,
              links: [
                { url: 'https://www.youtube.com/watch?v=example_cam' },
              ],
              comments: [],
              date: '2026-06-13T11:00:00Z',
            },
          ],
        },
      ],
    },

    gezi: {
      categories: [
        {
          id: 'cat-gezi-1',
          name: 'Ege Turu 2026',
          desc: 'Haziran ayı Ege seyahatimiz için notlar ve rotalar',
          topics: [
            {
              id: 'topic-gezi-1',
              title: 'Alaçatı — Tam Rota ve Tavsiyeler',
              content: `Alaçatı hayatımı değiştirdi diyebilirim 🌸\n\nKonaklama: Taş evlere dönüştürülmüş butik otelleri tercih edin. Biz Vino Locale\'de kaldık, bahçesi mükemmeldi.\n\nYemek:\n🍽️ Agrilia Restaurant — Ege mezeleri için\n☕ Ahu Tonguç — Sabah kahvaltısı\n🍦 Köy dondurmacısı — kaçırmayın!\n\nGezilecek Yerler:\n📍 Antik Çeşme Agora\n📍 Alaçatı Rüzgar Sörfü Okulu (denemeye değer!)\n📍 Cumartesi Pazarı\n\nNot: Araç kiralayın, toplu taşıma zayıf.`,
              links: [
                { url: 'https://www.instagram.com/p/alacati_example' },
                { url: 'https://www.youtube.com/watch?v=alacati_video' },
              ],
              comments: [
                { id: 'comment-z1', author: 'Zeynep', text: 'Kaç gün gitmeyi planlıyoruz? 3 gün yeterli mi?', date: '2026-06-12T19:30:00Z' },
                { id: 'comment-z2', author: 'Yazarı', text: 'En az 4 gün! Çeşme\'yi de ekleyecekseniz 5 gün lazım.', date: '2026-06-12T20:00:00Z' },
              ],
              date: '2026-06-10T09:00:00Z',
            },
          ],
        },
        {
          id: 'cat-gezi-2',
          name: 'Yurt Di\u015f\u0131 Ka\u00e7amaklar\u0131',
          desc: 'Kom\u015fu \u00fclkeler ve uzak diyarlara k\u0131sa turlar',
          topics: [
            {
              id: 'topic-gezi-2',
              title: 'Selanik Hafta Sonu \u2014 Vize Gerekiyor mu?',
              content: `Selanik art\u0131k \u00e7ok kolay \ud83c\uddec\ud83c\uddf7\n\nVize: TC vatanda\u015flar\u0131 i\u00e7in Schengen vizesi gerekiyor.\n\nUla\u015f\u0131m: \u0130stanbul'dan direkt otob\u00fcs var (12 saat), ama u\u00e7u\u015f tercih edin.\n\nB\u00fct\u00e7e: 4 g\u00fcn 2 ki\u015fi yakla\u015f\u0131k 500\u20ac (u\u00e7u\u015f dahil)`,
              links: [],
              comments: [],
              date: '2026-06-14T10:00:00Z',
            },
          ],
        },
      ],
    },
    dizi_film: {
      categories: [
        {
          id: 'cat-dizi-1',
          name: 'Bilim Kurgu Dizileri',
          desc: 'Gelecekten hikayeler, distopyalar ve teknoloji',
          topics: [
            {
              id: 'topic-dizi-1',
              title: 'Severance İncelemesi',
              content: `İş ve özel hayat dengesi hiç bu kadar sarsıcı anlatılmamıştı. Apple TV+'ın bu başyapıtı, ofis yaşamının rutinini bir kabusa çeviriyor.\n\nGörsel dilindeki simetri, retro-fütüristik ofis tasarımı ve harika oyunculuklar diziyi bir adım öne çıkarıyor. Kesinlikle şans verilmeli!`,
              links: [],
              comments: [],
              date: '2026-06-15T20:00:00Z',
            }
          ]
        },
        {
          id: 'cat-dizi-2',
          name: 'Kült Filmler',
          desc: 'Sinema tarihine damga vuran yapımlar',
          topics: [
            {
              id: 'topic-dizi-2',
              title: 'Fight Club Detayları',
              content: `İlk kural kulüpten bahsetmemek! David Fincher'ın bu efsane filmi sadece bir dövüş kulübü değil, modern tüketim toplumunun en sert eleştirisidir.\n\nBrad Pitt ve Edward Norton'ın kimyası ve Tyler Durden felsefesi... Her izleyişte yeni bir detay fark ediyorsunuz.`,
              links: [],
              comments: [],
              date: '2026-06-16T18:00:00Z',
            }
          ]
        }
      ]
    },
    satin_alma: {
      categories: [
        {
          id: 'cat-satin-1',
          name: 'Kamp Ekipmanları',
          desc: 'Doğaya çıkmadan önce alınması gerekenler',
          topics: [
            {
              id: 'topic-satin-1',
              title: 'Fiyat/Performans Çadır Önerileri',
              content: `İlk kamp deneyimi için binlerce lira harcamaya gerek yok.\n\nDecathlon'un Arpenaz serisi (Fresh&Black özellikle) yaz kampları için inanılmaz bir fiyat/performans ürünü. Su geçirmezliği ve rüzgar direnci gayet yeterli. Altına iyi bir mat almayı unutmayın!`,
              links: [],
              comments: [],
              date: '2026-06-12T14:30:00Z',
            }
          ]
        },
        {
          id: 'cat-satin-2',
          name: 'Mutfak Robotları',
          desc: 'Mutfaktaki küçük yardımcılar',
          topics: [
            {
              id: 'topic-satin-2',
              title: 'Airfryer Alırken Dikkat Edilmesi Gerekenler',
              content: `Son dönemin en popüler mutfak aleti!\n\n1. Kapasite (Hazne büyüklüğü en önemli şey, 4L altı aile için yetersiz)\n2. Watt gücü (Hızlı ısınma için önemli)\n3. Sepet malzemesi (Teflon mu seramik mi? Seramik daha sağlıklı ve yapışmazlık ömrü daha uzun)\n\nÖnerim: Philips XXL veya Xiaomi Smart Fryer.`,
              links: [],
              comments: [],
              date: '2026-06-14T11:00:00Z',
            }
          ]
        }
      ]
    }
  };
}

// \u2500\u2500\u2500 LocalStorage Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadDB() {
  // ── STEP 1: Paint from localStorage instantly (zero-latency warm start) ──
  try {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      db = JSON.parse(cached);
      // Guarantee every page key exists so the rest of the app never crashes
      Object.keys(PAGES).forEach(key => {
        if (!db[key])             db[key] = { categories: [] };
        if (!db[key].categories)  db[key].categories = [];
      });
      console.log('[loadDB] localStorage önbelleği yüklendi.');
    }
  } catch (lsErr) {
    console.warn('[loadDB] localStorage parse hatası, atlanıyor:', lsErr.message);
  }

  // ── STEP 2: Fetch authoritative data from Supabase ───────────────────────
  if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('app_state')
        .select('data')
        .eq('id', 1)
        .single();

      if (error) {
        // PGRST116 = "no rows returned" → first run, not a real error
        if (error.code !== 'PGRST116') {
          console.error('[loadDB] Supabase SELECT hatası:', error.message, '| kod:', error.code, '| hint:', error.hint);
        } else {
          console.log('[loadDB] Supabase\'de henüz kayıt yok (ilk kullanım), localStorage/mock ile devam ediliyor.');
        }
      } else if (data && data.data) {
        // ✅ Got fresh data from Supabase — overwrite local cache
        db = data.data;
        Object.keys(PAGES).forEach(key => {
          if (!db[key])            db[key] = { categories: [] };
          if (!db[key].categories) db[key].categories = [];
        });
        // Keep localStorage in sync so next refresh is instant
        try { localStorage.setItem(LS_KEY, JSON.stringify(db)); } catch {}
        console.log('[loadDB] Supabase\'den güncel veri yüklendi.');
        return; // Done — Supabase data is the truth
      }
    } catch (netErr) {
      console.error('[loadDB] Supabase ağ/istisna hatası:', netErr.message ?? netErr);
      // Continue — we'll use whatever we got from localStorage in Step 1
    }
  }

  // ── STEP 3: If we still have no db at all, seed with mock data ───────────
  const hasData = db && Object.keys(PAGES).some(k => (db[k]?.categories || []).length > 0);
  if (!hasData) {
    console.log('[loadDB] Veri bulunamadı, örnek veriler yükleniyor...');
    const mock = getMockData();
    db = {};
    Object.keys(PAGES).forEach(key => { db[key] = mock[key] || { categories: [] }; });
    // Persist mock to localStorage and try to push to Supabase
    try { localStorage.setItem(LS_KEY, JSON.stringify(db)); } catch {}
    await saveDB(); // Best-effort — won't throw if Supabase is down
  }
}

async function saveDB() {
  // 1. Always write to localStorage immediately so the user never loses data
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  } catch (lsErr) {
    console.error('[saveDB] localStorage yazma hatası:', lsErr);
  }

  // 2. Sync to Supabase if available
  if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    try {
      // Log exactly what we're sending so mismatches are visible
      console.log('[saveDB] Supabase\'e gönderilen payload:', { id: 1, data_keys: Object.keys(db) });

      const { error } = await supabaseClient
        .from('app_state')
        .upsert({ id: 1, data: db }, { onConflict: 'id' });

      if (error) {
        // Print the FULL raw error object so we can diagnose the exact rejection reason
        console.error('[saveDB] Supabase upsert HATASI (tam):', JSON.stringify(error, null, 2));
        console.error('[saveDB] → message:', error.message);
        console.error('[saveDB] → code:', error.code);
        console.error('[saveDB] → details:', error.details);
        console.error('[saveDB] → hint:', error.hint);
        showToast('Sunucuya kaydedilemedi, yerel kopya güncellendi.', 'error');
      } else {
        console.log('[saveDB] Supabase\'e başarıyla kaydedildi ✅');
      }
    } catch (netErr) {
      console.error('[saveDB] Ağ/Supabase istisnası (tam):', netErr);
      showToast('İnternet bağlantısı yok, veriler yerel olarak kaydedildi.', 'error');
    }
  }
}

//  AUTH SYSTEM  —  Supabase primary, LocalStorage fallback
//  Works on file:// (localStorage) and served (Supabase)
// ═══════════════════════════════════════════════════════════════════════════

const AUTH_LS_KEY = 'antigravity_auth';

function isSupabaseReady() {
  return typeof supabaseClient !== 'undefined' && supabaseClient !== null;
}

let _currentUser = null;
function getCurrentUser() { return _currentUser; }

function _setCurrentUser(user) {
  _currentUser = user;
  updateAuthUI();
  const ca = document.getElementById('comment-author');
  if (ca && user && !ca.value) ca.value = user.name;
  updateQALoginPrompt();
}

function _lsLoadAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_LS_KEY) || '{}'); }
  catch { return {}; }
}
function _lsSaveAuth(d) {
  try { localStorage.setItem(AUTH_LS_KEY, JSON.stringify(d)); } catch {}
}

function initSupabaseAuthListener() {
  if (!isSupabaseReady()) {
    const d = _lsLoadAuth();
    if (d.currentUser) _setCurrentUser(d.currentUser);
    return;
  }
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
      const user = session.user;
      const name = user.user_metadata?.name || user.email.split('@')[0];
      _setCurrentUser({ name, email: user.email, uid: user.id });
    } else {
      _setCurrentUser(null);
    }
  });
}

function signInWithGoogle() {
  const supabaseUrl = "https://rcifcttqhkupbofbaxyq.supabase.co";
  const redirectUrl = "http://localhost:3000";
  window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
}

let authMode = 'login';
function switchAuthTab(mode) {
  authMode = mode;
  document.getElementById('tab-login')?.classList.toggle('active', mode === 'login');
  document.getElementById('tab-register')?.classList.toggle('active', mode === 'register');
  const ng = document.getElementById('auth-name-group');
  if (ng) ng.style.display = mode === 'register' ? '' : 'none';
  const lbl = document.getElementById('auth-btn-label');
  if (lbl) lbl.textContent = mode === 'register' ? 'Kayıt Ol' : 'Giriş Yap';
  clearAuthErrors();
}

async function handleEmailAuth() {
  const email    = (document.getElementById('auth-email-input')?.value || '').trim();
  const password = document.getElementById('auth-password-input')?.value || '';
  const name     = (document.getElementById('auth-name-input')?.value || '').trim();
  clearAuthErrors();
  let valid = true;
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRx.test(email)) { document.getElementById('auth-email-input')?.classList.add('form-error'); document.getElementById('auth-email-error')?.classList.add('show'); valid = false; }
  if (!password || password.length < 6) { document.getElementById('auth-password-input')?.classList.add('form-error'); document.getElementById('auth-password-error')?.classList.add('show'); valid = false; }
  if (authMode === 'register' && !name) { document.getElementById('auth-name-input')?.classList.add('form-error'); document.getElementById('auth-name-error')?.classList.add('show'); valid = false; }
  if (!valid) return;

  if (isSupabaseReady()) {
    setAuthLoading(true);
    try {
      if (authMode === 'register') {
        const { data, error } = await supabaseClient.auth.signUp({
          email, password, options: { data: { name } }
        });
        if (error) throw error;
        showToast('Hesabın oluşturuldu, hoş geldin ' + name + '! 🎉', 'success');
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast('Tekrar hoş geldin! 👋', 'success');
      }
      closeModal('auth-modal');
      return;
    } catch (err) {
      showAuthError(err.message); 
      setAuthLoading(false); 
      return;
    } finally { setAuthLoading(false); }
  }

  const d = _lsLoadAuth();
  const users = d.users || [];
  if (authMode === 'register') {
    if (users.find(u => u.email === email)) { showAuthError('Bu e-posta zaten kayıtlı. Giriş Yap sekmesini dene.'); return; }
    users.push({ email, name, createdAt: new Date().toISOString() });
    _lsSaveAuth({ users, currentUser: { email, name } });
    _setCurrentUser({ email, name, uid: null });
    showToast('Hesabın oluşturuldu, hoş geldin ' + name + '! 🎉', 'success');
  } else {
    const existing = users.find(u => u.email === email);
    if (!existing) { showAuthError('Bu e-posta ile kayıtlı hesap bulunamadı. Kayıt Ol sekmesini dene.'); return; }
    _lsSaveAuth({ users, currentUser: { email, name: existing.name } });
    _setCurrentUser({ email, name: existing.name, uid: null });
    showToast('Tekrar hoş geldin, ' + existing.name + '! 👋', 'success');
  }
  closeModal('auth-modal');
}

async function logout() {
  if (isSupabaseReady()) { try { await supabaseClient.auth.signOut(); } catch {} }
  const d = _lsLoadAuth();
  d.currentUser = null;
  _lsSaveAuth(d);
  _setCurrentUser(null);
  showToast('Güvenle çıkış yapıldı.', 'info');
}

function updateAuthUI() {
  const user      = getCurrentUser();
  const loggedOut = document.getElementById('auth-logged-out');
  const loggedIn  = document.getElementById('auth-logged-in');
  if (!loggedOut || !loggedIn) return;
  if (user) {
    loggedOut.style.display = 'none';
    loggedIn.style.display  = 'block';
    document.getElementById('sidebar-user-name').textContent  = user.name;
    document.getElementById('sidebar-user-email').textContent = user.email;
    const avatarEl = document.getElementById('sidebar-avatar');
    avatarEl.textContent      = user.name.charAt(0).toUpperCase();
    avatarEl.style.background = getAvatarColor(user.name);
  } else {
    loggedOut.style.display = 'block';
    loggedIn.style.display  = 'none';
  }
  updateQALoginPrompt();
}

function updateQALoginPrompt() {
  const prompt    = document.getElementById('qa-login-prompt');
  const inputArea = document.getElementById('qa-input-area');
  if (!prompt || !inputArea) return;
  const user = getCurrentUser();
  prompt.style.display    = user ? 'none'  : 'block';
  inputArea.style.display = user ? 'block' : 'none';
}

function setAuthLoading(loading) {
  ['auth-submit-btn','btn-google'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.disabled = loading; el.style.opacity = loading ? '0.6' : '1'; }
  });
}

function clearAuthErrors() {
  ['auth-email-input','auth-password-input','auth-name-input'].forEach(id => document.getElementById(id)?.classList.remove('form-error'));
  ['auth-email-error','auth-password-error','auth-name-error'].forEach(id => document.getElementById(id)?.classList.remove('show'));
  const fb = document.getElementById('auth-feedback');
  if (fb) fb.style.display = 'none';
}

function showAuthError(msg) {
  const fb = document.getElementById('auth-feedback');
  if (!fb) return;
  fb.style.display = 'block';
  fb.className     = 'auth-feedback error';
  fb.innerHTML     = '❌ ' + escHtml(msg);
}

function togglePasswordVisibility() {
  const input = document.getElementById('auth-password-input');
  const icon  = document.getElementById('pw-eye-icon');
  if (!input) return;
  if (input.type === 'password') { input.type = 'text'; if (icon) icon.className = 'fa-solid fa-eye-slash'; }
  else { input.type = 'password'; if (icon) icon.className = 'fa-solid fa-eye'; }
}

function getFriendlyError(code) {
  const map = {
    'auth/user-not-found':         'Bu e-posta ile kayitli hesap bulunamadi.',
    'auth/wrong-password':         'Sifre hatali. Lutfen tekrar dene.',
    'auth/invalid-credential':     'E-posta veya sifre hatali.',
    'auth/email-already-in-use':   'Bu e-posta zaten kullaniliyor. Giris Yap sekmesini dene.',
    'auth/weak-password':          'Sifre cok zayif. En az 6 karakter kullan.',
    'auth/invalid-email':          'Gecersiz e-posta adresi.',
    'auth/popup-closed-by-user':   'Giris penceresi kapatildi.',
    'auth/network-request-failed': 'Ag hatasi. Internet baglantiyi kontrol et.',
    'auth/too-many-requests':      'Cok fazla basarisiz deneme. Lutfen bekle.',
    'auth/popup-blocked':          "Tarayicin popup'i engelledi. Popup'lara izin ver.",
    'auth/operation-not-allowed':  "Bu giris yontemi etkinlestirilmemis.",
    'auth/unauthorized-domain':    "Bu domain yetkili degil.",
  };
  return map[code] || 'Hata olustu (' + code + ').';
}

// ─── ID Generator ────────────────────────────────────────────────────────────
function genId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Format Date ─────────────────────────────────────────────────────────────
function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const iconMap = { success: '✅', error: '❌', info: 'ℹ️' };
  t.innerHTML = `<span>${iconMap[type] || '✅'}</span> ${msg}`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut 0.28s cubic-bezier(.4,0,.2,1) forwards';
    setTimeout(() => t.remove(), 300);
  }, duration);
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Track where the mouse button was pressed so we can distinguish
// a real backdrop click from a drag that started inside the modal.
let _modalMouseDownTarget = null;

document.addEventListener('mousedown', e => {
  _modalMouseDownTarget = e.target;
}, true);

function closeModalOnOverlay(e, id) {
  // Only close if BOTH mousedown AND mouseup (the click) targeted the backdrop.
  // If the user started a text selection inside the modal box and released
  // the mouse outside (on the backdrop), _modalMouseDownTarget will be an
  // element inside .modal-box, so the check below will prevent closing.
  if (
    e.target === e.currentTarget &&
    _modalMouseDownTarget === e.currentTarget
  ) {
    closeModal(id);
  }
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function navigateTo(pageKey, catId = null, topicId = null) {
  state.activePage    = pageKey;
  state.activeCatId   = catId;
  state.activeTopicId = topicId;

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById(`nav-${pageKey}`);
  if (navEl) navEl.classList.add('active');

  // Handle special case: Favorilerim
  if (pageKey === 'favoriler') {
    document.getElementById('topbar-title').innerHTML =
      `<img src="group.jpg" alt="" style="width:26px;height:26px;border-radius:7px;object-fit:cover;object-position:center top;flex-shrink:0;" /> ⭐ Favorilerim`;
    
    const mc = document.getElementById('main-content');
    mc.className = 'theme-peach'; // Default theme for favoriler
    
    // Hide mutfak fields just in case
    updateMutfakFields(pageKey);
    closeSidebar();
    
    renderFavorites();
    return;
  }

  // Mobile topbar title
  const page = PAGES[pageKey];
  if (!page) return; // Prevent crashes if pageKey is invalid

  document.getElementById('topbar-title').innerHTML =
    `<img src="group.jpg" alt="" style="width:26px;height:26px;border-radius:7px;object-fit:cover;object-position:center top;flex-shrink:0;" /> ${page.emoji} ${page.title}`;

  // Update theme on main content wrapper
  const mc = document.getElementById('main-content');
  mc.className = '';
  mc.classList.add(`theme-${page.theme}`);

  // Apply theme colours to buttons
  document.getElementById('new-cat-btn').className = `btn ${page.btnClass}`;
  document.getElementById('new-topic-btn').className = `btn ${page.btnClass}`;
  document.getElementById('cat-save-btn').className = `btn ${page.btnClass}`;
  document.getElementById('topic-save-btn').className = `btn ${page.btnClass}`;
  document.getElementById('edit-topic-save-btn').className = `btn ${page.btnClass}`;
  document.getElementById('comment-submit-btn').className = `btn ${page.btnClass} btn-submit`;

  // Focus input borders
  const catNameInput = document.getElementById('cat-name-input');
  catNameInput.style.setProperty('--current-accent', page.accent);

  if (topicId) {
    renderTopicDetail();
  } else if (catId) {
    renderTopicList();
  } else {
    renderCategoryList();
  }

  // Close mobile sidebar
  closeSidebar();

  // Show/hide mutfak-only fields in modals
  updateMutfakFields(pageKey);
}

// ─── Show / Hide Mutfak-Only Fields ─────────────────────────────────────────────────
function updateMutfakFields(pageKey) {
  const show = (pageKey === 'mutfak');
  const ids = [
    'mutfak-ingredients-group',
    'edit-mutfak-ingredients-group',
    'mutfak-tags-group',
    'edit-mutfak-tags-group',
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? '' : 'none';
  });
  // Also reset tag filter when changing pages
  if (!show) state.activeTagFilter = null;
}

// ─── View Switcher ────────────────────────────────────────────────────────────
function showView(viewId) {
  ['welcome-view', 'category-view', 'topic-view', 'topic-detail-view'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  const el = document.getElementById(viewId);
  el.style.display = '';
  el.classList.remove('animate-in');
  void el.offsetWidth; // reflow
  el.classList.add('animate-in');
}

// ─── Category List ────────────────────────────────────────────────────────────
function renderCategoryList() {
  showView('category-view');
  const page = PAGES[state.activePage];
  document.getElementById('cat-page-title').textContent = `${page.emoji} ${page.title}`;
  document.getElementById('cat-page-desc').textContent = page.subtitle;

  // Breadcrumb
  document.getElementById('cat-breadcrumb').innerHTML =
    `<span>${page.emoji} ${page.title}</span>`;

  const cats = db[state.activePage].categories;
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = '';

  if (cats.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">📂</div>
        <h3>Henüz kategori yok</h3>
        <p>Sağ üstteki "Yeni Kategori" butonuna tıklayarak<br/>ilk kategoriyi oluştur!</p>
      </div>`;
    return;
  }

  cats.forEach((cat, idx) => {
    const topicCount = (cat.topics || []).length;
    const card = document.createElement('div');
    card.className = `card animate-in stagger-${Math.min(idx + 1, 4)}`;
    card.onclick = () => navigateTo(state.activePage, cat.id);
    card.innerHTML = `
      <div class="card-icon">${getCategoryEmoji(state.activePage, idx)}</div>
      <div class="card-title">${escHtml(cat.name)}</div>
      <div class="card-meta">${cat.desc ? escHtml(cat.desc) : '&nbsp;'}</div>
      <div class="card-meta" style="margin-top:6px;">
        <span style="font-weight:700;">${topicCount}</span> yazı
      </div>
      <div class="card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
      <button class="btn btn-ghost" style="position:absolute;top:10px;right:10px;padding:5px 10px;font-size:0.75rem;z-index:2;"
        onclick="event.stopPropagation(); openEditCategory('${cat.id}')">
        <i class="fa-solid fa-pen"></i>
      </button>
    `;
    card.style.position = 'relative';
    grid.appendChild(card);
  });
}

function getCategoryEmoji(pageKey, idx) {
  const emojiSets = {
    mutfak:    ['🥘','🍞','🥗','🧁','🍝','🥩','🍜','☕'],
    gunluk:    ['🌅','📖','🎬','🎵','🏃','🌿','🎨','💭'],
    teknoloji: ['📱','💻','🎧','🖥️','⌨️','🔋','📷','🎮'],
    gezi:      ['🗺️','🏖️','⛺','🏔️','✈️','🛳️','🚂','🌍'],
  };
  const set = emojiSets[pageKey] || ['📁'];
  return set[idx % set.length];
}

// ─── Topic List ───────────────────────────────────────────────────────────────
function calculateInteractions(topic) {
  let likes = 0, dislikes = 0, userLike = 0;
  let isFavorite = false;
  const user = getCurrentUser();
  const uid = user ? (user.email || user.displayName) : null;

  if (topic.likes) {
    for (const [key, val] of Object.entries(topic.likes)) {
      if (val === 1) likes++;
      else if (val === -1) dislikes++;
      if (uid && key === uid) userLike = val;
    }
  }
  if (topic.favorites && uid) {
    isFavorite = topic.favorites.includes(uid);
  }
  return { score: likes - dislikes, likes, dislikes, userLike, isFavorite };
}

function createTopicCardHtml(topic, pageKey, catId, idx) {
  const linkCount = (topic.links || []).length;
  const commentCount = (topic.comments || []).length;
  const preview = topic.content ? topic.content.slice(0, 120).replace(/\n/g, ' ') + (topic.content.length > 120 ? '…' : '') : '';
  const hasMacros = topic.macros && topic.macros.calories > 0;
  
  const int = calculateInteractions(topic);
  
  // Notice we use stopPropagation() on buttons to avoid triggering the card click (navigateTo)
  return `
    <div class="topic-title">${escHtml(topic.title)}</div>
    <div class="topic-preview">${escHtml(preview)}</div>
    <div class="topic-meta">
      <span><i class="fa-regular fa-calendar" style="margin-right:4px;"></i>${formatDate(topic.date)}</span>
      ${commentCount > 0 ? `<span><i class="fa-regular fa-comment" style="margin-right:4px;"></i>${commentCount} yorum</span>` : ''}
      ${linkCount > 0 ? `<span><i class="fa-solid fa-link" style="margin-right:4px;"></i>${linkCount} link</span>` : ''}
      ${hasMacros ? `<span class="topic-kcal-badge">🔥 ${Math.round(topic.macros.calories)} kcal</span>` : ''}
    </div>
    <div class="interaction-bar">
      <button class="btn-interaction ${int.userLike === 1 ? 'active-like' : ''}" onclick="event.stopPropagation(); toggleLike('${pageKey}', '${catId}', '${topic.id}', 1)">
        👍 ${int.likes}
      </button>
      <button class="btn-interaction ${int.userLike === -1 ? 'active-dislike' : ''}" onclick="event.stopPropagation(); toggleLike('${pageKey}', '${catId}', '${topic.id}', -1)">
        👎 ${int.dislikes}
      </button>
      <button class="btn-interaction ${int.isFavorite ? 'active' : ''}" style="margin-left: auto;" onclick="event.stopPropagation(); toggleFavorite('${pageKey}', '${catId}', '${topic.id}')">
        ⭐ Favori
      </button>
    </div>
  `;
}

// ─── Topic List ───────────────────────────────────────────────────────────────
function renderTopicList() {
  showView('topic-view');
  const page = PAGES[state.activePage];
  const cats = db[state.activePage].categories;
  const cat = cats.find(c => c.id === state.activeCatId);
  if (!cat) { navigateTo(state.activePage); return; }

  // Breadcrumb
  document.getElementById('topic-breadcrumb').innerHTML = `
    <span class="bc-link" onclick="navigateTo('${state.activePage}')">${page.emoji} ${page.title}</span>
    <span class="sep">›</span>
    <span>${escHtml(cat.name)}</span>
  `;

  document.getElementById('topic-cat-name').textContent = `📁 ${cat.name}`;
  document.getElementById('topic-cat-desc').textContent = cat.desc || '';

  let topics = [...(cat.topics || [])];
  
  // Sorting logic
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect && sortSelect.value === 'most_liked') {
    topics.sort((a, b) => {
      const scoreA = calculateInteractions(a).score;
      const scoreB = calculateInteractions(b).score;
      return scoreB - scoreA;
    });
  } else {
    // Default: Newest
    topics.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const list = document.getElementById('topics-list');
  list.innerHTML = '';

  if (topics.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✍️</div>
        <h3>Bu kategoride yazı yok</h3>
        <p>"Yeni Yazı Ekle" butonuna tıklayarak<br/>ilk yazını paylaş!</p>
      </div>`;
    return;
  }

  topics.forEach((topic, idx) => {
    const card = document.createElement('div');
    card.className = `topic-card animate-in stagger-${Math.min(idx + 1, 4)}`;
    card.onclick = () => navigateTo(state.activePage, state.activeCatId, topic.id);
    card.innerHTML = createTopicCardHtml(topic, state.activePage, state.activeCatId, idx);
    list.appendChild(card);
  });
}

// ─── Topic Detail ─────────────────────────────────────────────────────────────
function renderTopicDetail() {
  showView('topic-detail-view');
  const page = PAGES[state.activePage];
  const cats = db[state.activePage].categories;
  const cat = cats.find(c => c.id === state.activeCatId);
  if (!cat) { navigateTo(state.activePage); return; }
  const topic = (cat.topics || []).find(t => t.id === state.activeTopicId);
  if (!topic) { navigateTo(state.activePage, state.activeCatId); return; }

  // Breadcrumb
  document.getElementById('detail-breadcrumb').innerHTML = `
    <span class="bc-link" onclick="navigateTo('${state.activePage}')">${page.emoji} ${page.title}</span>
    <span class="sep">›</span>
    <span class="bc-link" onclick="navigateTo('${state.activePage}','${cat.id}')">${escHtml(cat.name)}</span>
    <span class="sep">›</span>
    <span>${escHtml(topic.title)}</span>
  `;

  document.getElementById('detail-title').textContent = topic.title;
  document.getElementById('detail-content').textContent = topic.content;

  // ── Reply Banner (Q&A cevap yazısı ise)
  const replyBanner = document.getElementById('reply-banner');
  if (topic.replyMeta) {
    replyBanner.style.display = 'block';
    replyBanner.innerHTML = `
      <i class="fa-solid fa-reply"></i>
      Bu yazı, <strong>${escHtml(topic.replyMeta.questionAuthorName)}</strong>'nın
      "<em>${escHtml(topic.replyMeta.questionText)}</em>" sorusuna cevap olarak eklenmiştir.
      <button class="btn-inline-link" onclick="navigateTo('${escAttr(topic.replyMeta.origPage)}','${escAttr(topic.replyMeta.origCatId)}','${escAttr(topic.replyMeta.origTopicId)}')">
        Orijinal yazıya git →
      </button>
    `;
  } else {
    replyBanner.style.display = 'none';
  }

  // ── Author Row
  const detailAuthor = document.getElementById('detail-author');
  if (topic.author) {
    detailAuthor.style.display = 'flex';
    detailAuthor.innerHTML = `
      <div class="detail-author-avatar" style="background:${getAvatarColor(topic.author.name)};">${topic.author.name.charAt(0).toUpperCase()}</div>
      <div>
        <div class="detail-author-name">${escHtml(topic.author.name)}</div>
        <div class="detail-author-date"><i class="fa-regular fa-clock" style="margin-right:3px;"></i>${formatDate(topic.date)}</div>
      </div>
    `;
  } else {
    detailAuthor.style.display = 'none';
  }

  // ── Tags Row (mutfak)
  const detailTags = document.getElementById('detail-tags');
  const topicTags = topic.tags || [];
  if (state.activePage === 'mutfak' && topicTags.length > 0) {
    detailTags.style.display = 'flex';
    detailTags.innerHTML = topicTags.map(t => {
      const td = RECIPE_TAGS.find(r => r.value === t);
      return td ? `<span class="detail-tag-badge" style="background:${td.color};color:${td.text};">${td.emoji} ${escHtml(td.value)}</span>` : '';
    }).join('');
  } else {
    detailTags.style.display = 'none';
  }

  // ── Makro Kartı (sadece mutfak sayfasında ve macro verisi varsa)
  const existingMacroCard = document.getElementById('macro-detail-card');
  if (existingMacroCard) existingMacroCard.remove();
  if (state.activePage === 'mutfak' && topic.macros && topic.macros.calories > 0) {
    const detailCard = document.querySelector('#topic-detail-view .detail-card');
    if (detailCard) {
      const macroEl = document.createElement('div');
      macroEl.id = 'macro-detail-card';
      macroEl.innerHTML = buildMacroDetailCard(topic.macros, topic.ingredients);
      detailCard.appendChild(macroEl);
      // Animate bars after render
      requestAnimationFrame(() => {
        detailCard.querySelectorAll('.macro-bar-fill').forEach(bar => {
          const w = bar.dataset.width;
          if (w) bar.style.width = w;
        });
      });
    }
  }

  // Images gallery
  const imagesSection = document.getElementById('detail-images');
  const imagesGrid    = document.getElementById('detail-images-grid');
  const images = topic.images || [];
  if (images.length > 0) {
    imagesSection.style.display = '';
    imagesGrid.innerHTML = '';
    images.forEach((dataUrl, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'gallery-img-wrap';
      wrap.innerHTML = `
        <img src="${dataUrl}" alt="Resim ${idx + 1}" loading="lazy" />
        <div class="img-zoom-hint"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
      `;
      wrap.addEventListener('click', () => openLightbox(images, idx));
      imagesGrid.appendChild(wrap);
    });
  } else {
    imagesSection.style.display = 'none';
  }

  // Links
  const linksSection = document.getElementById('detail-links');
  const linkButtons = document.getElementById('detail-link-buttons');
  const links = topic.links || [];

  if (links.length > 0) {
    linksSection.style.display = '';
    linkButtons.innerHTML = '';
    links.forEach(link => {
      const btn = buildLinkButton(link.url);
      linkButtons.appendChild(btn);
    });
  } else {
    linksSection.style.display = 'none';
  }

  // Comments
  renderComments(topic);

  // Q&A
  renderQA(topic);

  // Update Q&A login prompt state
  updateQALoginPrompt();
}

// ─── Link Button Builder ──────────────────────────────────────────────────────
function detectLinkType(url) {
  try {
    const u = url.toLowerCase();
    if (u.includes('youtube.com') || u.includes('youtu.be'))   return 'youtube';
    if (u.includes('instagram.com'))                            return 'instagram';
    if (u.includes('twitter.com') || u.includes('x.com'))      return 'twitter';
    if (u.includes('spotify.com'))                              return 'spotify';
    if (u.includes('medium.com') || u.includes('blog') || u.includes('wordpress') || u.includes('substack')) return 'blog';
    return 'web';
  } catch { return 'web'; }
}

function getLinkMeta(type) {
  const map = {
    youtube:   { icon: 'fa-brands fa-youtube',   label: 'YouTube\'da İzle', cls: 'youtube' },
    instagram: { icon: 'fa-brands fa-instagram',  label: 'Instagram\'da Gör', cls: 'instagram' },
    twitter:   { icon: 'fa-brands fa-x-twitter',  label: 'X\'te Gör', cls: 'twitter' },
    spotify:   { icon: 'fa-brands fa-spotify',    label: 'Spotify\'da Dinle', cls: 'spotify' },
    blog:      { icon: 'fa-solid fa-pen-nib',     label: 'Blog\'da Oku', cls: 'blog' },
    web:       { icon: 'fa-solid fa-arrow-up-right-from-square', label: 'Ziyaret Et', cls: 'web' },
  };
  return map[type] || map.web;
}

function buildLinkButton(url) {
  const type = detectLinkType(url);
  const meta = getLinkMeta(type);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className = `link-btn ${meta.cls}`;
  a.innerHTML = `<i class="${meta.icon}"></i> ${meta.label}`;
  return a;
}

// ─── Comments ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#3A7A5A','#E07A30','#2563EB','#8B3CF7','#D97706','#059669','#DC2626','#7C3AED'];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function renderComments(topic) {
  const comments = topic.comments || [];
  const list = document.getElementById('comments-list');
  const countBadge = document.getElementById('comment-count');

  // count comments + replies
  let totalComments = comments.length;
  comments.forEach(c => { if(c.replies) totalComments += c.replies.length; });

  countBadge.textContent = totalComments > 0 ? totalComments : '';
  countBadge.style.background = totalComments > 0 ? 'var(--border-soft)' : 'transparent';

  list.innerHTML = '';

  if (comments.length === 0) {
    list.innerHTML = `<p style="font-size:0.85rem;color:var(--text-soft);padding:8px 0;">Henüz yorum yok. İlk yorumu sen yap! 💬</p>`;
    return;
  }

  comments.forEach(comment => {
    const author = comment.author || 'Anonim';
    const initial = author.charAt(0).toUpperCase();
    const color = getAvatarColor(author);
    const item = document.createElement('div');
    item.className = 'comment-item';
    
    item.innerHTML = `
      <div class="comment-avatar" style="background:${color};">${initial}</div>
      <div class="comment-body" style="flex:1;">
        <div class="comment-author">${escHtml(author)}</div>
        <div class="comment-text">${escHtml(comment.text)}</div>
        <div class="comment-date">
          ${formatDate(comment.date)}
          <button class="comment-reply-btn" onclick="toggleReplyForm('${comment.id}')">Cevapla</button>
        </div>
        <div id="reply-form-${comment.id}" class="comment-reply-form" style="display:none;">
          <input type="text" id="reply-input-${comment.id}" placeholder="Cevabınızı yazın..." />
          <button class="btn btn-sm" onclick="submitReply('${comment.id}')">Gönder</button>
        </div>
        <div class="comment-replies" id="replies-${comment.id}"></div>
      </div>
    `;
    list.appendChild(item);

    // Render replies if they exist
    if (comment.replies && comment.replies.length > 0) {
      const repliesContainer = item.querySelector(`#replies-${comment.id}`);
      comment.replies.forEach(reply => {
        const rAuthor = reply.author || 'Anonim';
        const rInitial = rAuthor.charAt(0).toUpperCase();
        const rColor = getAvatarColor(rAuthor);
        const rItem = document.createElement('div');
        rItem.className = 'comment-item reply-item';
        rItem.innerHTML = `
          <div class="comment-avatar small" style="background:${rColor};">${rInitial}</div>
          <div class="comment-body" style="flex:1;">
            <div class="comment-author">${escHtml(rAuthor)}</div>
            <div class="comment-text">${escHtml(reply.text)}</div>
            <div class="comment-date">${formatDate(reply.date)}</div>
          </div>
        `;
        repliesContainer.appendChild(rItem);
      });
    }
  });
}

function toggleReplyForm(commentId) {
  const form = document.getElementById(`reply-form-${commentId}`);
  if (form) {
    form.style.display = form.style.display === 'none' ? 'flex' : 'none';
    if (form.style.display === 'flex') {
      const input = document.getElementById(`reply-input-${commentId}`);
      if (input) input.focus();
    }
  }
}

function submitReply(commentId) {
  const inputEl = document.getElementById(`reply-input-${commentId}`);
  const text = inputEl ? inputEl.value.trim() : '';

  if (!text) {
    inputEl?.classList.add('form-error');
    showToast('Lütfen bir cevap yazın!', 'error');
    return;
  }
  inputEl?.classList.remove('form-error');

  const currentUser = getCurrentUser();
  const authorName = currentUser ? currentUser.name : (document.getElementById('comment-author')?.value.trim() || 'Anonim');

  const cats  = db[state.activePage].categories;
  const cat   = cats.find(c => c.id === state.activeCatId);
  const topic = (cat?.topics || []).find(t => t.id === state.activeTopicId);
  if (!topic) return;

  const comment = (topic.comments || []).find(c => c.id === commentId);
  if (!comment) return;

  if (!comment.replies) comment.replies = [];
  comment.replies.push({
    id:     genId('reply'),
    author: authorName,
    text,
    date:   new Date().toISOString(),
  });

  saveDB();
  renderComments(topic);
  showToast('Cevabınız eklendi! 🎉', 'success');
}

function submitComment() {
  const authorEl = document.getElementById('comment-author');
  const textEl   = document.getElementById('comment-text');
  const text = textEl.value.trim();

  if (!text) {
    textEl.classList.add('form-error');
    showToast('Lütfen bir yorum yazın!', 'error');
    return;
  }
  textEl.classList.remove('form-error');

  const cats  = db[state.activePage].categories;
  const cat   = cats.find(c => c.id === state.activeCatId);
  const topic = (cat?.topics || []).find(t => t.id === state.activeTopicId);
  if (!topic) return;

  if (!topic.comments) topic.comments = [];
  topic.comments.push({
    id:     genId('comment'),
    author: authorEl.value.trim() || 'Anonim',
    text,
    date:   new Date().toISOString(),
  });

  saveDB();
  authorEl.value = '';
  textEl.value = '';
  renderComments(topic);
  showToast('Yorumun eklendi! 🎉', 'success');
}

// ─── Save Category ────────────────────────────────────────────────────────────
function saveCategory() {
  const nameEl = document.getElementById('cat-name-input');
  const descEl = document.getElementById('cat-desc-input');
  const errEl  = document.getElementById('cat-name-error');
  const name   = nameEl.value.trim();

  // Validation
  if (!name) {
    nameEl.classList.add('form-error');
    errEl.classList.add('show');
    return;
  }
  nameEl.classList.remove('form-error');
  errEl.classList.remove('show');

  const newCat = {
    id:          genId('cat'),
    name,
    desc:        descEl.value.trim(),
    topics:      [],
    author:      getCurrentUser() || null,
    date:        new Date().toISOString(),
  };

  db[state.activePage].categories.push(newCat);
  saveDB();

  closeModal('category-modal');
  nameEl.value = '';
  descEl.value = '';

  renderCategoryList();
  showToast(`"${name}" kategorisi oluşturuldu! 📁`, 'success');
}

function openEditCategory(catId) {
  const cats = db[state.activePage].categories;
  const cat = cats.find(c => c.id === catId);
  if (!cat) return;
  document.getElementById('edit-cat-id').value = catId;
  document.getElementById('edit-cat-name-input').value = cat.name;
  document.getElementById('edit-cat-desc-input').value = cat.desc || '';
  document.getElementById('edit-cat-name-error').classList.remove('show');
  document.getElementById('edit-cat-name-input').classList.remove('form-error');
  openModal('edit-category-modal');
}

function saveEditCategory() {
  const catId  = document.getElementById('edit-cat-id').value;
  const nameEl = document.getElementById('edit-cat-name-input');
  const descEl = document.getElementById('edit-cat-desc-input');
  const errEl  = document.getElementById('edit-cat-name-error');
  const name   = nameEl.value.trim();

  if (!name) {
    nameEl.classList.add('form-error');
    errEl.classList.add('show');
    return;
  }
  nameEl.classList.remove('form-error');
  errEl.classList.remove('show');

  const cats = db[state.activePage].categories;
  const cat  = cats.find(c => c.id === catId);
  if (!cat) return;

  cat.name = name;
  cat.desc = descEl.value.trim();
  saveDB();

  closeModal('edit-category-modal');
  renderCategoryList();
  showToast(`"${name}" kategorisi güncellendi! ✏️`, 'success');
}

// ─── Link Row Helpers (New Topic Modal) ──────────────────────────────────────
function addLinkRow(containerId = 'link-rows-container') {
  const container = document.getElementById(containerId);
  const row = document.createElement('div');
  row.className = 'link-row';
  row.innerHTML = `
    <input type="url" placeholder="https://youtube.com/watch?v=..." />
    <button class="rm-link" title="Kaldır" onclick="this.closest('.link-row').remove()">
      <i class="fa-solid fa-times"></i>
    </button>
  `;
  container.appendChild(row);
  row.querySelector('input').focus();
}

function addEditLinkRow() {
  addLinkRow('edit-link-rows-container');
}

function getLinkRowValues(containerId) {
  const rows = document.querySelectorAll(`#${containerId} .link-row input`);
  const links = [];
  rows.forEach(input => {
    const url = input.value.trim();
    if (url) links.push({ url });
  });
  return links;
}

// ─── Save Topic ───────────────────────────────────────────────────────────────
async function saveTopic() {
  const titleEl   = document.getElementById('topic-title-input');
  const contentEl = document.getElementById('topic-content-input');
  const titleErr  = document.getElementById('topic-title-error');
  const contentErr = document.getElementById('topic-content-error');

  const title   = titleEl.value.trim();
  const content = contentEl.value.trim();
  let valid = true;

  if (!title) {
    titleEl.classList.add('form-error');
    titleErr.classList.add('show');
    valid = false;
  } else {
    titleEl.classList.remove('form-error');
    titleErr.classList.remove('show');
  }

  if (!content) {
    contentEl.classList.add('form-error');
    contentErr.classList.add('show');
    valid = false;
  } else {
    contentEl.classList.remove('form-error');
    contentErr.classList.remove('show');
  }

  if (!valid) return;

  const links = getLinkRowValues('link-rows-container');

  const cats = db[state.activePage].categories;
  const cat  = cats.find(c => c.id === state.activeCatId);
  if (!cat) return;

  const images      = getImagesFromPreviewList('img-preview-list');
  const ingredients = document.getElementById('ingredients-input')?.value.trim() || '';
  const macros      = ingredients ? calculateMacros(ingredients) : null;

  // Tags (mutfak only)
  const tags = [];
  document.querySelectorAll('#tag-checkboxes input[type=checkbox]:checked').forEach(cb => tags.push(cb.value));

  // Q&A reply context
  const replyMeta = state.qaReplyContext ? {
    questionId:         state.qaReplyContext.questionId,
    questionText:       state.qaReplyContext.questionText,
    questionAuthorName: state.qaReplyContext.questionAuthorName,
    origPage:           state.qaReplyContext.origPage,
    origCatId:          state.qaReplyContext.origCatId,
    origTopicId:        state.qaReplyContext.origTopicId,
  } : null;

  if (!cat.topics) cat.topics = [];
  const newTopic = {
    id:          genId('topic'),
    title,
    content,
    links,
    images,
    ingredients: ingredients || null,
    macros,
    tags,
    replyMeta,
    questions:   [],
    comments:    [],
    author:      getCurrentUser() || null,
    date:        new Date().toISOString(),
  };
  cat.topics.push(newTopic);

  // Mark question as answered
  if (replyMeta) {
    markQuestionAnswered(replyMeta.origPage, replyMeta.origCatId, replyMeta.origTopicId, replyMeta.questionId, newTopic.id);
  }

  try {
    await saveDB(); // ← await so we know the write actually completed
  } catch (err) {
    // Rollback: remove the topic we just added
    console.error('[saveTopic] Kaydetme başarısız, geri alınıyor:', err);
    cat.topics.pop();
    showToast('Yazı sunucuya kaydedilemedi. Lütfen tekrar deneyin.', 'error');
    return;
  }

  // ✅ Saved successfully — now clean up the form
  closeModal('topic-modal');
  titleEl.value   = '';
  contentEl.value = '';
  document.getElementById('link-rows-container').innerHTML = '';
  document.getElementById('img-preview-list').innerHTML = '';
  const ingInput = document.getElementById('ingredients-input');
  if (ingInput) ingInput.value = '';
  const livePreview = document.getElementById('macro-live-preview');
  if (livePreview) { livePreview.innerHTML = ''; livePreview.classList.remove('visible'); }
  document.querySelectorAll('#tag-checkboxes input[type=checkbox]').forEach(cb => cb.checked = false);
  state.qaReplyContext = null;
  document.getElementById('topic-reply-context').style.display = 'none';

  renderTopicList();
  renderHomeFeed();
  const kcalMsg = macros && macros.calories > 0 ? ` (🔥 ${Math.round(macros.calories)} kcal)` : '';
  showToast(`"${title}" yazısı eklendi!${kcalMsg}`, 'success');
}

// ─── Edit Topic ───────────────────────────────────────────────────────────────
function openEditTopicModal() {
  const cats  = db[state.activePage].categories;
  const cat   = cats.find(c => c.id === state.activeCatId);
  const topic = (cat?.topics || []).find(t => t.id === state.activeTopicId);
  if (!topic) return;

  state.editingTopicId = topic.id;
  document.getElementById('edit-topic-title').value   = topic.title;
  document.getElementById('edit-topic-content').value = topic.content;

  const container = document.getElementById('edit-link-rows-container');
  container.innerHTML = '';
  (topic.links || []).forEach(link => {
    const row = document.createElement('div');
    row.className = 'link-row';
    row.innerHTML = `
      <input type="url" value="${escAttr(link.url)}" />
      <button class="rm-link" title="Kaldır" onclick="this.closest('.link-row').remove()">
        <i class="fa-solid fa-times"></i>
      </button>
    `;
    container.appendChild(row);
  });

  // Populate existing images as previews
  const editPreviewList = document.getElementById('edit-img-preview-list');
  editPreviewList.innerHTML = '';
  (topic.images || []).forEach(dataUrl => {
    appendImagePreview(dataUrl, 'edit-img-preview-list');
  });

  openModal('edit-topic-modal');
}

async function saveEditTopic() {
  const titleEl   = document.getElementById('edit-topic-title');
  const contentEl = document.getElementById('edit-topic-content');
  const titleErr  = document.getElementById('edit-topic-title-error');
  const contentErr = document.getElementById('edit-topic-content-error');

  const title   = titleEl.value.trim();
  const content = contentEl.value.trim();
  let valid = true;

  if (!title) {
    titleEl.classList.add('form-error');
    titleErr.classList.add('show');
    valid = false;
  } else {
    titleEl.classList.remove('form-error');
    titleErr.classList.remove('show');
  }
  if (!content) {
    contentEl.classList.add('form-error');
    contentErr.classList.add('show');
    valid = false;
  } else {
    contentEl.classList.remove('form-error');
    contentErr.classList.remove('show');
  }
  if (!valid) return;

  const links   = getLinkRowValues('edit-link-rows-container');
  const images  = getImagesFromPreviewList('edit-img-preview-list');
  const ingredients = document.getElementById('edit-ingredients-input')?.value.trim() || '';
  const macros  = ingredients ? calculateMacros(ingredients) : null;

  // Tags (mutfak only)
  const tags = [];
  document.querySelectorAll('#edit-tag-checkboxes input[type=checkbox]:checked').forEach(cb => tags.push(cb.value));

  const cats  = db[state.activePage].categories;
  const cat   = cats.find(c => c.id === state.activeCatId);
  const topic = (cat?.topics || []).find(t => t.id === state.editingTopicId);
  if (!topic) return;

  // Save old values for rollback
  const oldTitle       = topic.title;
  const oldContent     = topic.content;
  const oldLinks       = topic.links;
  const oldImages      = topic.images;
  const oldIngredients = topic.ingredients;
  const oldMacros      = topic.macros;
  const oldTags        = topic.tags;

  topic.title       = title;
  topic.content     = content;
  topic.links       = links;
  topic.images      = images;
  topic.ingredients = ingredients || null;
  topic.macros      = macros;
  topic.tags        = tags;

  try {
    await saveDB(); // ← await so we confirm the write completed
  } catch (err) {
    // Rollback: restore the old values
    console.error('[saveEditTopic] Güncelleme kaydedilemedi, geri alınıyor:', err);
    topic.title       = oldTitle;
    topic.content     = oldContent;
    topic.links       = oldLinks;
    topic.images      = oldImages;
    topic.ingredients = oldIngredients;
    topic.macros      = oldMacros;
    topic.tags        = oldTags;
    showToast('Güncelleme sunucuya kaydedilemedi. Lütfen tekrar deneyin.', 'error');
    return;
  }

  closeModal('edit-topic-modal');
  state.editingTopicId = null;
  renderTopicDetail();
  renderHomeFeed();
  showToast('Yazı güncellendi! ✅', 'success');
}

async function deleteCurrentTopic() {
  if (!confirm('Bu yazıyı silmek istediğine emin misin?')) return;

  const cats = db[state.activePage].categories;
  const cat  = cats.find(c => c.id === state.activeCatId);
  if (!cat) return;

  const idx = (cat.topics || []).findIndex(t => t.id === state.activeTopicId);
  if (idx === -1) return;

  const title        = cat.topics[idx].title;
  const deletedTopic = cat.topics.splice(idx, 1)[0]; // remove from db

  // Persist deletion — await so we know if it actually reached Supabase
  try {
    await saveDB();
    // ✅ Deletion confirmed (localStorage + Supabase updated)
    closeModal('edit-topic-modal');
    state.activeTopicId  = null;
    state.editingTopicId = null;
    renderHomeFeed(); // remove from feed too
    navigateTo(state.activePage, state.activeCatId);
    showToast(`"${title}" yazısı silindi.`, 'info');
  } catch (err) {
    // ❌ Save failed — put the topic back to avoid data inconsistency
    console.error('[deleteCurrentTopic] Silme kaydedilemedi, geri alınıyor:', err);
    cat.topics.splice(idx, 0, deletedTopic); // rollback
    showToast('Silme işlemi sunucuya kaydedilemedi. Lütfen tekrar deneyin.', 'error');
  }
}

// ─── Mobile Sidebar ───────────────────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('drawer-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
}

// ─── Escape Helpers ───────────────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escAttr(str) {
  return String(str || '').replace(/"/g, '&quot;');
}

// ─── Keyboard Accessibility ───────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['category-modal','edit-category-modal','topic-modal','edit-topic-modal','auth-modal'].forEach(id => closeModal(id));
    closeSidebar();
  }
  // Allow Enter key on nav items
  if (e.key === 'Enter' && e.target.classList.contains('nav-item')) {
    const page = e.target.dataset.page;
    if (page) navigateTo(page);
  }
});

// ─── Reset Category Modal on Open ────────────────────────────────────────────
const origOpenModal = openModal;
// Override to reset form fields when opening specific modals
document.addEventListener('click', e => {
  if (e.target.id === 'new-cat-btn' || e.target.closest('#new-cat-btn')) {
    document.getElementById('cat-name-input').value = '';
    document.getElementById('cat-desc-input').value = '';
    document.getElementById('cat-name-input').classList.remove('form-error');
    document.getElementById('cat-name-error').classList.remove('show');
  }
  if (e.target.id === 'new-topic-btn' || e.target.closest('#new-topic-btn')) {
    document.getElementById('topic-title-input').value = '';
    document.getElementById('topic-content-input').value = '';
    document.getElementById('link-rows-container').innerHTML = '';
    document.getElementById('img-preview-list').innerHTML = '';
    document.getElementById('img-file-input').value = '';
    const ingEl = document.getElementById('ingredients-input');
    if (ingEl) ingEl.value = '';
    const prevEl = document.getElementById('macro-live-preview');
    if (prevEl) { prevEl.innerHTML = ''; prevEl.classList.remove('visible'); }
    ['topic-title-input','topic-content-input'].forEach(id => {
      document.getElementById(id).classList.remove('form-error');
    });
    ['topic-title-error','topic-content-error'].forEach(id => {
      document.getElementById(id).classList.remove('show');
    });
  }
});

// ─── MAKRO HESAPLAMA ENGINE ──────────────────────────────────────────────────────────────────
function normalizeTr(s) {
  return s.toLowerCase()
    .replace(/ı/g,'i').replace(/İ/g,'i').replace(/ş/g,'s').replace(/Ş/g,'s')
    .replace(/ö/g,'o').replace(/Ö/g,'o').replace(/ü/g,'u').replace(/Ü/g,'u')
    .replace(/ğ/g,'g').replace(/Ğ/g,'g').replace(/ç/g,'c').replace(/Ç/g,'c')
    .trim();
}

function matchFood(foodName) {
  const norm = normalizeTr(foodName);
  // Exact or partial match
  for (const entry of FOOD_DB) {
    for (const n of entry.names) {
      if (normalizeTr(n) === norm) return entry;
    }
  }
  // Partial match (food name contains a db entry name or vice versa)
  for (const entry of FOOD_DB) {
    for (const n of entry.names) {
      const normN = normalizeTr(n);
      if (norm.includes(normN) || normN.includes(norm)) return entry;
    }
  }
  return null;
}

function toGrams(qty, unit, foodEntry) {
  const u = unit ? normalizeTr(unit) : 'g';
  // Check food-specific unit overrides first
  if (foodEntry && foodEntry.units) {
    const overrideKeys = Object.keys(foodEntry.units);
    for (const ok of overrideKeys) {
      if (normalizeTr(ok) === u) return qty * foodEntry.units[ok];
    }
  }
  // Check global unit table
  const globalKeys = Object.keys(UNIT_TO_GRAMS);
  for (const gk of globalKeys) {
    if (normalizeTr(gk) === u) return qty * UNIT_TO_GRAMS[gk];
  }
  // Default: treat as grams
  return qty;
}

function parseIngredientLine(line) {
  const cleaned = line.trim().replace(/^[-•*–—]\s*/, '');
  if (!cleaned) return null;

  // Pattern: number (optional comma/dot decimal) + optional unit + food name
  const rx = /^(\d+(?:[.,]\d+)?)\s*([a-zçğıöşüâîû.]+(?:\s+[a-zçğıöşüâîû]+)?)\s+(.+)$/iu;
  const rx2 = /^(\d+(?:[.,]\d+)?)\s+(.+)$/u; // just number + food

  let m = cleaned.match(rx);
  if (m) {
    const qty  = parseFloat(m[1].replace(',','.'));
    const unit = m[2].trim();
    const food = m[3].trim();
    // Verify unit is known; if not, treat unit+food as full food name
    const normUnit = normalizeTr(unit);
    const isKnownUnit = Object.keys(UNIT_TO_GRAMS).some(k => normalizeTr(k) === normUnit)
      || (matchFood(unit) === null && food.length > 0);
    if (isKnownUnit) {
      return { raw: line, qty, unit, food };
    }
    return { raw: line, qty, unit: 'g', food: unit + ' ' + food };
  }
  m = cleaned.match(rx2);
  if (m) {
    return { raw: line, qty: parseFloat(m[1]), unit: 'adet', food: m[2].trim() };
  }
  // No number found
  return { raw: line, qty: 100, unit: 'g', food: cleaned, guessed: true };
}

function calculateMacros(ingredientText) {
  const lines = ingredientText.split('\n').filter(l => l.trim());
  let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const recognized   = [];
  const unrecognized = [];

  for (const line of lines) {
    const parsed = parseIngredientLine(line);
    if (!parsed) continue;

    const entry = matchFood(parsed.food);
    if (!entry) {
      unrecognized.push(parsed.food);
      continue;
    }

    const grams = toGrams(parsed.qty, parsed.unit, entry);
    const factor = grams / 100;

    total.calories += entry.cal * factor;
    total.protein  += entry.p   * factor;
    total.carbs    += entry.c   * factor;
    total.fat      += entry.f   * factor;

    recognized.push(`${parsed.qty}${parsed.unit !== 'g' ? ' ' + parsed.unit : 'g'} ${entry.names[0]}`);
  }

  return {
    calories:     Math.round(total.calories),
    protein:      Math.round(total.protein  * 10) / 10,
    carbs:        Math.round(total.carbs    * 10) / 10,
    fat:          Math.round(total.fat      * 10) / 10,
    recognized,
    unrecognized,
  };
}

// ─── Macro UI Builder ───────────────────────────────────────────────────────────────────
function macroBarHtml(cls, dotClass, label, value, max, unit = 'g') {
  const pct = Math.min((value / max) * 100, 100);
  return `
    <div class="macro-bar-row">
      <div class="macro-bar-label">
        <span class="macro-dot ${dotClass}"></span>
        <span>${label}</span>
      </div>
      <div class="macro-bar-track">
        <div class="macro-bar-fill ${cls}-fill" data-width="${pct.toFixed(1)}%" style="width:0%"></div>
      </div>
      <span class="macro-bar-value">${value}${unit}</span>
    </div>`;
}

function buildMacroPreviewHtml(macros) {
  return `
    <div class="macro-live-header">
      <span class="macro-live-title">🔥 Hesaplanan Besin Değleri</span>
      <span class="calorie-badge">🔥 ${macros.calories} kcal</span>
    </div>
    <div class="macro-pills">
      <span class="macro-pill macro-pill-protein">💪 Protein: ${macros.protein}g</span>
      <span class="macro-pill macro-pill-carbs">🍞 Karbonhidrat: ${macros.carbs}g</span>
      <span class="macro-pill macro-pill-fat">🧴 Yağ: ${macros.fat}g</span>
    </div>
    <div class="macro-bars">
      ${macroBarHtml('protein','protein-dot','Protein', macros.protein, 150)}
      ${macroBarHtml('carb','carb-dot','Karbonhidrat', macros.carbs, 300)}
      ${macroBarHtml('fat','fat-dot','Yağ', macros.fat, 65)}
    </div>
    ${macros.unrecognized.length > 0 ? `<div class="macro-warn">⚠️ Tanınamadı: ${macros.unrecognized.map(escHtml).join(', ')}</div>` : ''}
  `;
}

function buildMacroDetailCard(macros, ingredients) {
  // SVG donut ring
  const r = 30, circ = 2 * Math.PI * r;
  const pct = Math.min(macros.calories / 2500, 1);
  const dash = (pct * circ).toFixed(2);
  const gap  = (circ - pct * circ).toFixed(2);

  const tags = (macros.recognized || []).map(n =>
    `<span class="ing-tag">${escHtml(n)}</span>`).join('');
  const unrecTags = (macros.unrecognized || []).map(n =>
    `<span class="ing-tag unrecognized">${escHtml(n)}</span>`).join('');

  return `
    <div class="macro-detail-card">
      <div class="macro-detail-header">
        <div class="macro-detail-title">
          🔥 Besin Değleri
          <span style="font-size:0.73rem;font-weight:600;color:#B45309;">(tahmini, porsiyon başına)</span>
        </div>
        <div class="macro-detail-kcal">
          <div class="macro-kcal-ring-wrap">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="${r}" fill="none" stroke="#FEF3C7" stroke-width="7" />
              <circle cx="36" cy="36" r="${r}" fill="none"
                stroke="url(#kcalGrad)" stroke-width="7"
                stroke-linecap="round"
                stroke-dasharray="${dash} ${gap}" />
              <defs>
                <linearGradient id="kcalGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#FB923C"/>
                  <stop offset="100%" stop-color="#EF4444"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="kcal-text">
              <span class="kcal-num">${macros.calories}</span>
              <span class="kcal-label">kcal</span>
            </div>
          </div>
        </div>
      </div>
      <div class="macro-detail-pills-row">
        <span class="macro-detail-pill protein">💪 Protein &nbsp;<strong>${macros.protein}g</strong></span>
        <span class="macro-detail-pill carbs">🍞 Karbonhidrat &nbsp;<strong>${macros.carbs}g</strong></span>
        <span class="macro-detail-pill fat">🧴 Yağ &nbsp;<strong>${macros.fat}g</strong></span>
      </div>
      <div class="macro-detail-bars">
        ${macroBarHtml('protein','protein-dot','Protein', macros.protein, 150)}
        ${macroBarHtml('carb','carb-dot','Karbonhidrat', macros.carbs, 300)}
        ${macroBarHtml('fat','fat-dot','Yağ', macros.fat, 65)}
      </div>
      ${tags || unrecTags ? `
      <div class="macro-ingredients-list">
        <div class="ing-title"><i class="fa-solid fa-list-check" style="margin-right:5px;"></i>Hesaplanan Malzemeler</div>
        <div class="ing-tags">${tags}${unrecTags}</div>
      </div>` : ''}
    </div>
  `;
}

// ─── Live Preview Trigger ─────────────────────────────────────────────────────────────────
function previewMacros(textareaId, previewDivId) {
  const text = document.getElementById(textareaId)?.value.trim();
  const previewEl = document.getElementById(previewDivId);
  if (!previewEl) return;
  if (!text) {
    previewEl.innerHTML = '';
    previewEl.classList.remove('visible');
    showToast('Malzeme yazılmadı!', 'error');
    return;
  }
  const macros = calculateMacros(text);
  if (macros.calories === 0 && macros.recognized.length === 0) {
    previewEl.innerHTML = `<div class="macro-warn">⚠️ Hiçbir malzeme tanınamadı. Lütfen "200g tavuk göğsü" formatında yazın.</div>`;
    previewEl.classList.add('visible');
    return;
  }
  previewEl.innerHTML = buildMacroPreviewHtml(macros);
  previewEl.classList.add('visible');
  // Animate bars
  requestAnimationFrame(() => {
    previewEl.querySelectorAll('.macro-bar-fill').forEach(bar => {
      const w = bar.dataset.width;
      if (w) bar.style.width = w;
    });
  });
  showToast(`Hesaplandı: ${macros.calories} kcal 🔥`, 'success');
}

// ─── Image Handling ───────────────────────────────────────────────────────────

// Max file size: 5 MB
const MAX_IMG_SIZE = 5 * 1024 * 1024;

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}
function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}
function handleDrop(e, previewListId) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
  processImageFiles(files, previewListId);
}
function handleFileSelect(e, previewListId) {
  const files = Array.from(e.target.files);
  processImageFiles(files, previewListId);
  e.target.value = ''; // reset so same file can be re-selected
}

function processImageFiles(files, previewListId) {
  files.forEach(file => {
    if (file.size > MAX_IMG_SIZE) {
      showToast(`"${file.name}" çok büyük (max 5 MB)`, 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      appendImagePreview(ev.target.result, previewListId);
    };
    reader.readAsDataURL(file);
  });
}

function appendImagePreview(dataUrl, previewListId) {
  const container = document.getElementById(previewListId);
  const item = document.createElement('div');
  item.className = 'img-preview-item';
  item.dataset.dataUrl = dataUrl;
  item.innerHTML = `
    <img src="${dataUrl}" alt="Önizleme" />
    <button class="rm-img" title="Kaldır" onclick="this.closest('.img-preview-item').remove()">
      <i class="fa-solid fa-times"></i>
    </button>
  `;
  container.appendChild(item);
}

function getImagesFromPreviewList(previewListId) {
  const items = document.querySelectorAll(`#${previewListId} .img-preview-item`);
  return Array.from(items).map(el => el.dataset.dataUrl).filter(Boolean);
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
let lightboxImages = [];
let lightboxIndex  = 0;

function openLightbox(images, startIdx) {
  lightboxImages = images;
  lightboxIndex  = startIdx;
  updateLightboxImage();
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  lightboxImages = [];
}
function lightboxPrev() {
  if (lightboxImages.length < 2) return;
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}
function lightboxNext() {
  if (lightboxImages.length < 2) return;
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  updateLightboxImage();
}
function updateLightboxImage() {
  document.getElementById('lightbox-img').src = lightboxImages[lightboxIndex];
  document.getElementById('lightbox-counter').textContent =
    lightboxImages.length > 1 ? `${lightboxIndex + 1} / ${lightboxImages.length}` : '';
  const navEl = document.getElementById('lightbox-nav');
  navEl.style.display = lightboxImages.length > 1 ? 'flex' : 'none';
}

// ─── Filter Bar (Mutfak Tags) ────────────────────────────────────────────────
function renderFilterBar(barId, pageKey, activeTag) {
  const bar = document.getElementById(barId);
  if (!bar) return;

  if (pageKey !== 'mutfak') {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }

  bar.style.display = 'flex';
  const currentFilter = activeTag !== undefined ? activeTag : state.activeTagFilter;

  let html = `<button class="filter-btn${!currentFilter ? ' active' : ''}" onclick="applyTagFilter(null)">Tümü</button>`;
  RECIPE_TAGS.forEach(tag => {
    const isActive = currentFilter === tag.value;
    html += `<button class="filter-btn${isActive ? ' active' : ''}" style="${isActive ? `background:${tag.color};color:${tag.text};border-color:${tag.text};` : ''}" onclick="applyTagFilter('${escAttr(tag.value)}')">${tag.emoji} ${escHtml(tag.value)}</button>`;
  });
  bar.innerHTML = html;
}

function applyTagFilter(tag) {
  state.activeTagFilter = tag || null;
  if (document.getElementById('topic-view').style.display !== 'none') {
    renderTopicList(state.activeTagFilter);
  } else {
    renderCategoryList();
  }
}

// ─── Q&A System ──────────────────────────────────────────────────────────────
function renderQA(topic) {
  const list      = document.getElementById('qa-list');
  const countEl   = document.getElementById('qa-count');
  if (!list || !countEl) return;
  const questions = topic.questions || [];

  countEl.textContent = questions.length > 0 ? questions.length : '';
  countEl.style.background = questions.length > 0 ? 'var(--border-soft)' : 'transparent';

  list.innerHTML = '';

  if (questions.length === 0) {
    list.innerHTML = `<p style="font-size:0.85rem;color:var(--text-soft);padding:8px 0;">Henüz soru yok. İlk soruyu sen sor! ❓</p>`;
  } else {
    questions.forEach(q => {
      const authorName = q.author ? q.author.name : 'Anonim';
      const initial    = authorName.charAt(0).toUpperCase();
      const color      = getAvatarColor(authorName);

      const answerBadge = q.answeredTopicId
        ? `<span class="qa-answered-badge"><i class="fa-solid fa-check"></i> Cevaplandı</span>`
        : `<button class="qa-answer-btn" onclick="openAnswerTopicModal('${escAttr(q.id)}','${escAttr(q.text)}')"><i class="fa-solid fa-pen-to-square"></i> Yazı Olarak Cevapla</button>`;

      const item = document.createElement('div');
      item.className = 'qa-item';
      item.innerHTML = `
        <div class="qa-item-header">
          <div class="comment-avatar" style="background:${color};width:32px;height:32px;font-size:0.78rem;">${initial}</div>
          <div class="qa-item-meta">
            <span class="qa-item-author">${escHtml(authorName)}</span>
            <span class="qa-item-date">${formatDate(q.date)}</span>
          </div>
        </div>
        <div class="qa-item-text">❓ ${escHtml(q.text)}</div>
        <div class="qa-item-actions">${answerBadge}</div>
      `;
      list.appendChild(item);
    });
  }

  updateQALoginPrompt();
}

function submitQuestion() {
  const textEl = document.getElementById('qa-question-text');
  const text   = textEl.value.trim();
  if (!text) {
    textEl.classList.add('form-error');
    showToast('Lütfen bir soru yaz!', 'error');
    return;
  }
  textEl.classList.remove('form-error');

  const user = getCurrentUser();
  if (!user) {
    showToast('Soru sormak için giriş yapmalısın!', 'error');
    openModal('auth-modal');
    return;
  }

  const cats  = db[state.activePage].categories;
  const cat   = cats.find(c => c.id === state.activeCatId);
  const topic = (cat?.topics || []).find(t => t.id === state.activeTopicId);
  if (!topic) return;

  if (!topic.questions) topic.questions = [];
  topic.questions.push({
    id:     genId('q'),
    text,
    author: user,
    date:   new Date().toISOString(),
    answeredTopicId: null,
  });

  saveDB();
  textEl.value = '';
  renderQA(topic);
  showToast('Sorun eklendi! 💡', 'success');
}

function openAnswerTopicModal(questionId, questionText) {
  const cats     = db[state.activePage].categories;
  const cat      = cats.find(c => c.id === state.activeCatId);
  const topic    = (cat?.topics || []).find(t => t.id === state.activeTopicId);
  const question = (topic?.questions || []).find(q => q.id === questionId);
  if (!question) return;

  state.qaReplyContext = {
    questionId,
    questionText,
    questionAuthorName: question.author ? question.author.name : 'Anonim',
    origPage:    state.activePage,
    origCatId:   state.activeCatId,
    origTopicId: state.activeTopicId,
  };

  const banner = document.getElementById('topic-reply-context');
  banner.style.display = 'block';
  banner.innerHTML = `
    <i class="fa-solid fa-reply"></i>
    <strong>Cevap yazısı:</strong> "${escHtml(questionText.slice(0, 60))}" sorusuna cevap olarak eklenecek.
  `;

  document.getElementById('topic-title-input').value = `"${questionText.slice(0, 50)}" Sorusuna Cevap`;
  openModal('topic-modal');
}

function markQuestionAnswered(page, catId, topicId, questionId, answerTopicId) {
  const cat   = (db[page]?.categories || []).find(c => c.id === catId);
  const topic = (cat?.topics || []).find(t => t.id === topicId);
  const q     = (topic?.questions || []).find(q => q.id === questionId);
  if (q) q.answeredTopicId = answerTopicId;
}

// ─── Home Feed & Navigation ───────────────────────────────────────────────────
function goHome() {
  state.activePage = null;
  state.activeCatId = null;
  state.activeTopicId = null;
  
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  
  const topbarTitle = document.getElementById('topbar-title');
  if (topbarTitle) {
    topbarTitle.innerHTML = `<img src="group.jpg" alt="" style="width:28px;height:28px;border-radius:7px;object-fit:cover;object-position:center top;flex-shrink:0;" /> Kültür Sanat ve Yaşam Sözlüğü`;
  }
  
  const mc = document.getElementById('main-content');
  if (mc) mc.className = '';
  
  showView('welcome-view');
  renderHomeFeed();
  closeSidebar();
}

function renderHomeFeed() {
  const feedList = document.getElementById('home-feed-list');
  if (!feedList) return;
  feedList.innerHTML = '';
  
  let allTopics = [];
  
  Object.keys(db).forEach(pageKey => {
    if (pageKey === 'version') return;
    const pageData = db[pageKey];
    if (pageData && pageData.categories) {
      pageData.categories.forEach(cat => {
        if (cat.topics) {
          cat.topics.forEach(topic => {
            allTopics.push({ topic, pageKey, catId: cat.id });
          });
        }
      });
    }
  });
  
  // Sort by date descending — handle both 'date' and 'createdAt' field names
  allTopics.sort((a, b) => {
    const dateA = new Date(b.topic.date || b.topic.createdAt || 0);
    const dateB = new Date(a.topic.date || a.topic.createdAt || 0);
    return dateA - dateB;
  });
  
  const topTopics = allTopics.slice(0, 15);
  
  if (topTopics.length === 0) {
    feedList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🍃</div>
        <h3>Henüz İçerik Yok</h3>
        <p>Sol menüden bir kategori seçip ilk yazıyı sen ekleyebilirsin.</p>
      </div>`;
    return;
  }
  
  topTopics.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = `topic-card animate-in stagger-${Math.min(idx + 1, 4)}`;
    card.style.cursor = 'pointer';
    card.onclick = () => navigateTo(item.pageKey, item.catId, item.topic.id);
    
    card.innerHTML = createTopicCardHtml(item.topic, item.pageKey, item.catId, idx);
    
    const catObj = (db[item.pageKey]?.categories || []).find(c => c.id === item.catId);
    const catName = catObj ? catObj.name : 'Kategori';
    const contextHtml = `<div style="font-size:0.75rem; color:var(--text-soft); font-weight:600; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
      <span>${PAGES[item.pageKey]?.emoji} ${PAGES[item.pageKey]?.title}</span>
      <i class="fa-solid fa-chevron-right" style="font-size:0.6rem;opacity:0.5;"></i>
      <span>${escHtml(catName)}</span>
    </div>`;
    
    card.insertAdjacentHTML('afterbegin', contextHtml);
    feedList.appendChild(card);
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
(async function init() {
  await loadDB();
  showView('welcome-view');
  renderHomeFeed();

  // Start Supabase auth listener (session persistence)
  initSupabaseAuthListener();

  // Initial UI state (will be immediately overridden by onAuthStateChanged)
  updateAuthUI();

  // Inject lightbox element
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <button id="lightbox-close" onclick="closeLightbox()" aria-label="Kapat"><i class="fa-solid fa-xmark"></i></button>
    <img id="lightbox-img" src="" alt="Büyük Görünüm" />
    <div id="lightbox-nav">
      <button onclick="lightboxPrev()"><i class="fa-solid fa-chevron-left"></i> Önceki</button>
      <span id="lightbox-counter"></span>
      <button onclick="lightboxNext()">Sonraki <i class="fa-solid fa-chevron-right"></i></button>
    </div>
  `;
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.body.appendChild(lb);

  // Lightbox keyboard nav
  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'Escape')     closeLightbox();
  });

  console.log('✅ Kültür Sanat ve Yaşam Sözlüğü — uygulama başlatıldı. DB:', db);
})();
// ─── Interactions (Likes & Favorites) ───────────────────────────────────────────
function toggleLike(pageKey, catId, topicId, val) {
  const user = getCurrentUser();
  if (!user) {
    showToast('Lütfen giriş yapın', 'error');
    openModal('auth-modal');
    return;
  }
  const uid = user.email || user.displayName;
  if (!uid) return;

  const cats = db[pageKey]?.categories || [];
  const cat = cats.find(c => c.id === catId);
  if (!cat) return;
  const topic = (cat.topics || []).find(t => t.id === topicId);
  if (!topic) return;

  if (!topic.likes) topic.likes = {};
  
  if (topic.likes[uid] === val) {
    // Already liked/disliked with same val, remove it (toggle off)
    delete topic.likes[uid];
  } else {
    // Set to new val
    topic.likes[uid] = val;
  }
  
  saveDB();
  // Re-render
  if (state.activePage === 'favoriler') {
    renderFavorites();
  } else if (state.activePage && state.activeCatId && !state.activeTopicId) {
    renderTopicList();
  } else if (state.activeTopicId) {
    // We could re-render topic detail here, but interactions are currently on lists
  }
}

function toggleFavorite(pageKey, catId, topicId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('Lütfen giriş yapın', 'error');
    openModal('auth-modal');
    return;
  }
  const uid = user.email || user.displayName;
  if (!uid) return;

  const cats = db[pageKey]?.categories || [];
  const cat = cats.find(c => c.id === catId);
  if (!cat) return;
  const topic = (cat.topics || []).find(t => t.id === topicId);
  if (!topic) return;

  if (!topic.favorites) topic.favorites = [];
  
  const idx = topic.favorites.indexOf(uid);
  if (idx > -1) {
    topic.favorites.splice(idx, 1);
  } else {
    topic.favorites.push(uid);
  }
  
  saveDB();
  // Re-render
  if (state.activePage === 'favoriler') {
    renderFavorites();
  } else if (state.activePage && state.activeCatId && !state.activeTopicId) {
    renderTopicList();
  }
}

// ─── Favorites Page ───────────────────────────────────────────────────────────
function renderFavorites() {
  showView('topic-view');
  
  // Breadcrumb
  document.getElementById('topic-breadcrumb').innerHTML = `
    <span>⭐ Favorilerim</span>
  `;

  document.getElementById('topic-cat-name').textContent = `⭐ Favorilerim`;
  document.getElementById('topic-cat-desc').textContent = 'Kaydettiğiniz tüm içerikler burada.';

  // Hide the regular sort select and "Yeni Yazı Ekle" button in the header
  const headerActions = document.querySelector('#topic-view .page-header > div:nth-child(2)');
  if (headerActions) headerActions.style.display = 'none';

  // Inject a page filter into the topic-filter-bar
  const filterBar = document.getElementById('topic-filter-bar');
  filterBar.style.display = 'flex';
  
  let optionsHtml = `<option value="all">Tüm Sayfalar</option>`;
  Object.keys(PAGES).forEach(pk => {
    optionsHtml += `<option value="${pk}">${PAGES[pk].title}</option>`;
  });

  const currentFilter = state.favPageFilter || 'all';

  filterBar.innerHTML = `
    <select id="fav-page-select" onchange="state.favPageFilter = this.value; renderFavorites()" style="padding: 8px 12px; border: 1px solid var(--border-soft); border-radius: 8px; font-size: 0.85rem; background: var(--bg-card); cursor: pointer; color: var(--text-main);">
      ${optionsHtml}
    </select>
  `;
  document.getElementById('fav-page-select').value = currentFilter;

  const list = document.getElementById('topics-list');
  list.innerHTML = '';

  const user = getCurrentUser();
  if (!user) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔒</div>
        <h3>Giriş Yapmalısınız</h3>
        <p>Favorilerinizi görmek için lütfen giriş yapın.</p>
        <button class="btn btn-primary-peach" style="margin-top: 10px;" onclick="openModal('auth-modal')">Giriş Yap</button>
      </div>`;
    return;
  }
  const uid = user.email || user.displayName;

  // Gather all favorited topics
  let favTopics = [];
  
  Object.keys(PAGES).forEach(pk => {
    if (currentFilter !== 'all' && currentFilter !== pk) return; // filter by page
    
    const cats = db[pk]?.categories || [];
    cats.forEach(cat => {
      const topics = cat.topics || [];
      topics.forEach(t => {
        if (t.favorites && t.favorites.includes(uid)) {
          favTopics.push({ topic: t, pageKey: pk, catId: cat.id });
        }
      });
    });
  });

  // Sort by newest
  favTopics.sort((a, b) => new Date(b.topic.date) - new Date(a.topic.date));

  if (favTopics.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⭐</div>
        <h3>Favori içeriğiniz yok</h3>
        <p>İçerik kartlarındaki favori butonuna tıklayarak<br/>buraya kaydedebilirsiniz.</p>
      </div>`;
    return;
  }

  favTopics.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = `topic-card animate-in stagger-${Math.min(idx + 1, 4)}`;
    card.onclick = () => navigateTo(item.pageKey, item.catId, item.topic.id);
    
    // Create card HTML and inject page info context
    card.innerHTML = createTopicCardHtml(item.topic, item.pageKey, item.catId, idx);
    
    // Prepend page/category context above title
    const catObj = (db[item.pageKey]?.categories || []).find(c => c.id === item.catId);
    const catName = catObj ? catObj.name : 'Kategori';
    const contextHtml = `<div style="font-size:0.7rem; color:var(--text-soft); font-weight:600; margin-bottom:4px;">
      ${PAGES[item.pageKey]?.emoji} ${PAGES[item.pageKey]?.title} › ${escHtml(catName)}
    </div>`;
    
    card.insertAdjacentHTML('afterbegin', contextHtml);
    list.appendChild(card);
  });
}

// ─── Global Search ──────────────────────────────────────────────────────────────
function handleGlobalSearch(query) {
  const overlay = document.getElementById('search-results-overlay');
  if (!query || query.trim().length < 2) {
    overlay.style.display = 'none';
    return;
  }
  
  query = query.toLowerCase().trim();
  let results = [];
  
  // Scan all pages, categories and topics
  Object.keys(PAGES).forEach(pk => {
    const page = PAGES[pk];
    const cats = db[pk]?.categories || [];
    
    cats.forEach(cat => {
      // Check if category matches
      if (cat.name.toLowerCase().includes(query) || (cat.desc && cat.desc.toLowerCase().includes(query))) {
        results.push({
          type: 'category',
          title: `📁 ${cat.name}`,
          meta: `${page.emoji} ${page.title}`,
          onclick: `document.getElementById('global-search-input').value=''; document.getElementById('search-results-overlay').style.display='none'; navigateTo('${pk}', '${cat.id}')`,
          score: 10
        });
      }
      
      // Check topics
      const topics = cat.topics || [];
      topics.forEach(t => {
        let score = 0;
        if (t.title.toLowerCase().includes(query)) score += 20;
        if (t.content && t.content.toLowerCase().includes(query)) score += 5;
        
        if (score > 0) {
          results.push({
            type: 'topic',
            title: `📝 ${t.title}`,
            meta: `${page.emoji} ${page.title} › ${cat.name}`,
            onclick: `document.getElementById('global-search-input').value=''; document.getElementById('search-results-overlay').style.display='none'; navigateTo('${pk}', '${cat.id}', '${t.id}')`,
            score: score
          });
        }
      });
    });
  });
  
  // Sort by score
  results.sort((a, b) => b.score - a.score);
  
  // Render results
  if (results.length === 0) {
    overlay.innerHTML = `<div style="padding: 14px; text-align: center; color: var(--text-soft); font-size: 0.85rem;">Sonuç bulunamadı.</div>`;
  } else {
    let html = '';
    // Limit to top 8 results
    results.slice(0, 8).forEach(res => {
      html += `
        <div class="search-result-item" onclick="${res.onclick}">
          <div class="search-result-title">${escHtml(res.title)}</div>
          <div class="search-result-meta">${escHtml(res.meta)}</div>
        </div>
      `;
    });
    overlay.innerHTML = html;
  }
  
  overlay.style.display = 'block';
}

// Close search overlay if clicked outside
document.addEventListener('click', (e) => {
  const wrapper = document.querySelector('.global-search-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    const overlay = document.getElementById('search-results-overlay');
    if (overlay) overlay.style.display = 'none';
  }
});

// ─── AI Chatbot ───────────────────────────────────────────────────────────────
function toggleChatbot() {
  const win = document.getElementById('chatbot-window');
  if (win.style.display === 'none' || !win.classList.contains('open')) {
    win.style.display = 'flex';
    win.classList.add('open');
    document.getElementById('chatbot-input').focus();
  } else {
    win.classList.remove('open');
    setTimeout(() => { win.style.display = 'none'; }, 200);
  }
}

function sendChatMessage() {
  const input = document.getElementById('chatbot-input');
  const text = input.value.trim();
  if (!text) return;
  
  const messagesDiv = document.getElementById('chatbot-messages');
  
  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-bubble-user';
  userMsg.textContent = text;
  messagesDiv.appendChild(userMsg);
  
  input.value = '';
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  
  // Add typing indicator
  const typingMsg = document.createElement('div');
  typingMsg.className = 'chat-bubble-bot';
  typingMsg.id = 'typing-indicator';
  typingMsg.innerHTML = '<i class="fa-solid fa-ellipsis fa-fade"></i>';
  messagesDiv.appendChild(typingMsg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  
  // Simulate network delay for bot processing
  setTimeout(() => {
    typingMsg.remove();
    botReply(text);
  }, 800);
}

function botReply(userText) {
  const messagesDiv = document.getElementById('chatbot-messages');
  const lowerText = userText.toLowerCase();
  
  // Very basic NLP fallback keyword extraction
  const stopWords = ['mi', 'mı', 'mu', 'mü', 'var', 'yok', 'nedir', 'nasıl', 'nerede', 'bana', 'bir', 've', 'ile', 'için', 'öneri', 'öneriler', 'tavsiye', 'detay'];
  let keywords = lowerText.split(/[ \.\?\!,]+/).filter(w => w.length > 2 && !stopWords.includes(w));
  
  let matches = [];
  
  if (keywords.length > 0) {
    Object.keys(PAGES).forEach(pk => {
      const cats = db[pk]?.categories || [];
      cats.forEach(cat => {
        (cat.topics || []).forEach(t => {
          let score = 0;
          let contentLower = (t.title + " " + (t.content || "")).toLowerCase();
          
          keywords.forEach(kw => {
            if (contentLower.includes(kw)) score++;
          });
          
          if (score > 0) {
            matches.push({ topic: t, pageKey: pk, catId: cat.id, score: score });
          }
        });
      });
    });
  }
  
  matches.sort((a, b) => b.score - a.score);
  
  const botMsg = document.createElement('div');
  botMsg.className = 'chat-bubble-bot';
  
  if (matches.length > 0) {
    let replyHtml = `Şu içerikleri buldum ilgini çekebilir:<br/><br/>`;
    matches.slice(0, 3).forEach(m => {
      replyHtml += `• <a href="javascript:void(0)" onclick="toggleChatbot(); navigateTo('${m.pageKey}', '${m.catId}', '${m.topic.id}')" style="color: #0F766E; text-decoration: underline; font-weight: 600;">${escHtml(m.topic.title)}</a><br/>`;
    });
    botMsg.innerHTML = replyHtml;
  } else {
    // If no match, standard friendly fallback
    botMsg.textContent = "Maalesef bu konuyla ilgili doğrudan bir şey bulamadım. Ancak sol menüden kategorileri dolaşarak yeni şeyler keşfedebilir veya ilk yazan sen olabilirsin! 😊";
  }
  
  messagesDiv.appendChild(botMsg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
