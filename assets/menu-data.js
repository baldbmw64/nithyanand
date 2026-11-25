/* Speisekarte Mittagstisch – Daten aus lunch.pdf (geteilt von Speisekarte & Catering) */
const ALLERGENS = {
  1:['Glutenhaltiges Getreide','Cereals containing gluten'],2:['Krebstiere','Crustaceans'],3:['Eier','Eggs'],4:['Fisch','Fish'],
  5:['Erdnüsse','Peanuts'],6:['Sojabohnen','Soybeans'],7:['Milch','Milk'],8:['Schalenfrüchte (Nüsse)','Nuts'],9:['Sellerie','Celery'],
  10:['Senf','Mustard'],11:['Sesamsamen','Sesame seeds'],12:['Schwefeldioxid & Sulfite','Sulphur dioxide & sulphites'],13:['Lupine','Lupin'],14:['Weichtiere','Molluscs']
};
// [nr, name (string | [de,en]), devanagari, allergens, de, en, flags {v:veg, s:scharf}, price?]
const CATS = [
  { id:'salat', de:'Salat', en:'Salad', hi:'सलाद', sub:['Frisch & leicht zum Start.','Fresh and light to start.'], items:[
    [100,['Mix Salat','Mixed Salad'],'',[],'Grüner Salat mit Tomaten und Karotten.','Green salad with tomatoes and carrots.',{v:1},4.9],
    [101,['Sport Salat','Sport Salad'],'',[],'Salat mit Fisch, Eiern, Mais und Kichererbsen.','Salad with fish, eggs, corn and chickpeas.',{},13.9],
    [102,['Hähnchen Salat','Chicken Salad'],'',[],'Salat mit gegrilltem Hähnchen.','Salad with grilled chicken.',{},10.9],
  ]},
  { id:'fisch', de:'Fisch', en:'Fish', hi:'मछली', price:13.9, rice:1, sub:['Von der Küste – wie in Udupi.','From the coast – just like in Udupi.'], items:[
    [103,['Fisch Curry','Fish Curry'],'फिश करी',[4,7,8],'Heilbutt, sanft gegart in einer würzigen Zwiebel-Tomaten-Sauce.','Halibut gently braised in a spiced onion and tomato sauce.',{}],
  ]},
  { id:'veg', de:'Vegetarisch', en:'Vegetarian', hi:'शाकाहारी', price:10, rice:1, sub:['Das Herz der südindischen Küche.','The heart of South Indian cooking.'], items:[
    [104,'Aloo Gobi Masala','आलू गोभी मसाला',[7,8],'Kartoffeln und Blumenkohl, gekocht in einem klassischen Masala mit Tomaten, Zwiebeln und aromatischen indischen Gewürzen.','Potatoes and cauliflower cooked in a classic masala with tomatoes, onions and aromatic Indian spices.',{v:1}],
    [105,'Aloo Mattar','आलू मटर',[7,8],'Grüne Erbsen und Kartoffeln, sautiert mit frischen Gewürzen.','Green peas and potatoes, sautéed with fresh spices.',{v:1}],
    [106,'Banarasi Baingan','बनारसी बैंगन',[7,8],'Auberginen, langsam gegart in einer Banarasi-Masala.','Baby eggplant slowly cooked in a Banarasi-style masala with aromatic spices and gentle sweetness.',{v:1}],
    [107,['Eier Curry','Egg Curry'],'अंडा करी',[7,8],'Gekochte Eier, sanft gegart in einer würzigen Zwiebel-Tomaten-Sauce.','Boiled eggs simmered in a spiced onion and tomato gravy.',{v:1}],
    [108,'Mushroom Hara Damija','मशरूम हरा दामिज़ा',[7,8],'Champignons, sanft gegart mit frischen Kräutern, aromatischen Gewürzen und einem Hauch Sahne.','Mushrooms gently cooked with fresh herbs, aromatic spices and cream.',{v:1}],
    [109,'Matar Paneer','मटर पनीर',[7,8],'Paneerwürfel und grüne Erbsen in einer würzigen Zwiebel-Tomaten-Sauce.','Paneer cubes and green peas cooked in a spiced onion and tomato gravy.',{v:1}],
    [110,['Gemischtes Gemüse','Mixed Vegetables'],'मिक्स सब्ज़ियाँ',[7],'Eine Auswahl an Gemüse in einer milden Zwiebel-Tomaten-Sauce mit indischen Gewürzen.','A selection of vegetables cooked in a mild onion and tomato gravy.',{v:1}],
    [111,'Paneer Makhni','पनीर मक्खनी',[7,8],'Weiche Paneerwürfel in einer cremigen Tomaten-Butter-Sauce.','Soft paneer cubes simmered in a creamy tomato-butter sauce.',{v:1}],
    [112,'Maharani Dal','महारानी दाल',[7],'Langsam geschmorte schwarze Linsen und Kidneybohnen in einer cremigen Sauce mit Butter und indischen Gewürzen.','Slow-simmered black lentils and kidney beans in a creamy sauce with butter and Indian spices.',{v:1}],
    [113,'Gobhi Kaju Mattar','गोभी काजू मटर',[7,8],'Blumenkohlröschen mit grünen Erbsen und gerösteten Cashews in einer mild-nussigen Sauce mit indischen Gewürzen.','Cauliflower florets with green peas and roasted cashews in a mild, nutty gravy with Indian spices.',{v:1}],
    [114,'Palak Paneer','पालक पनीर',[7,8],'Weiche Paneerwürfel in einer feinen Spinatpurée-Sauce, mild gewürzt mit indischen Gewürzen.','Soft paneer cubes simmered in a smooth spinach purée, gently seasoned with Indian spices.',{v:1}],
    [115,'Dal Tadka','दाल तड़का',[7],'Cremige gelbe Linsen, verfeinert mit Kreuzkümmel, Knoblauch und getrockneten roten Chilis in Ghee.','Creamy yellow lentils tempered with cumin, garlic and dried red chilies in ghee.',{v:1}],
  ]},
  { id:'chicken', de:'Hähnchen', en:'Chicken', hi:'चिकन', price:12, rice:1, sub:['Aus dem Tandoor und dem Topf.','From the tandoor and the pot.'], items:[
    [116,['Chicken Tikka Masala','Murg Tikka Masala'],'चिकन टिक्का मसाला',[7,8],'Tandoori-gegrillte Hähnchenstücke in einer cremigen Tomaten-Butter-Sauce mit ausgewählten indischen Gewürzen.','Tandoor-grilled chicken pieces in a creamy tomato-butter sauce with selected Indian spices.',{s:1}],
    [117,'Butter Chicken','बटर चिकन',[7,8],'In Gewürzen mariniertes Hähnchen aus dem Tandoor, gegart in einer cremigen Tomaten-Butter-Sauce.','Chicken marinated in spices, grilled in the tandoor and simmered in a creamy tomato-butter sauce.',{}],
    [118,['Hühnchen Curry','Chicken Curry'],'चिकन करी',[7],'Schonend geschmortes Hähnchen in einer würzigen Zwiebel-Tomaten-Sauce.','Chicken slowly braised in a spiced onion and tomato gravy.',{}],
    [119,'Murg Palak','चिकन पालक',[7,8],'Zartes Hähnchen, sanft gegart in einer feinen Spinatpurée-Sauce, mild gewürzt mit indischen Gewürzen.','Tender chicken simmered in a smooth spinach purée, gently seasoned with mild Indian spices.',{}],
    [120,'Chicken Mughlai','चिकन मुग़लई',[7,8],'Hähnchen in einer cremigen Mughlai-Sauce aus Ei, Cashew, Zwiebeln und fein abgestimmten Gewürzen.','Chicken cooked in a creamy Mughlai-style gravy with egg, cashew, onion and delicate aromatic spices.',{}],
    [121,'Chicken Dopiaza','चिकन दोपियाज़ा',[7],'Zartes Hähnchen in einer kräftigen Zwiebel-Tomaten-Sauce mit zwei Arten von Zwiebeln und ausgewogener Würze.','Tender chicken cooked in a rich onion-tomato gravy with two styles of onions and balanced spices.',{}],
    [122,['Hühnchen Mango Curry','Chicken Mango Curry'],'आम चिकन करी',[7,8],'Zarte Hähnchenstücke in einer mild-würzigen Sahnesauce mit Alphonso-Mangopüree.','Tender chicken pieces in a lightly spiced creamy sauce with Alphonso mango pulp.',{}],
    [123,'Chicken Chilli Masala','चिकन चिली मसाला',[8],'Zartes Hähnchen in einer reichhaltigen Patiala-Sauce mit Tomaten, Zwiebeln, Paprika und kräftigen indo-chinesischen Aromen.','Tender chicken cooked in a rich Patiala-style gravy with tomatoes, onions, peppers and bold Indo-Chinese flavours.',{s:1}],
  ]},
  { id:'lamm', de:'Lamm', en:'Lamb', hi:'गोश्त', price:13.9, rice:1, sub:['Langsam geschmort, tief aromatisch.','Slow-braised, deeply aromatic.'], items:[
    [124,['Lamm Curry','Lamb Curry'],'लैम्ब करी',[7],'Langsam geschmortes Lamm in einer würzigen Zwiebel-Tomaten-Sauce.','Lamb slowly braised in a spiced onion and tomato gravy.',{}],
    [125,'Gosht Palak','गोश्त पालक',[7,8],'Zartes Lamm, sanft gegart in einer feinen Spinatpurée-Sauce mit milden indischen Gewürzen.','Tender lamb simmered in a smooth spinach purée, gently seasoned with mild Indian spices.',{}],
    [126,'Gosht Aloo','आलू गोश्त',[7],'Zartes Lamm mit Kartoffeln in einer kräftigen Zwiebel-Tomaten-Sauce, traditionell gewürzt.','Tender lamb cooked with potatoes in a rich onion and tomato gravy with traditional spices.',{s:1}],
    [127,['Lamm Badami','Lamb Badami'],'लैम्ब बादामी',[7,8],'Saftige Lammstücke, sanft gegart in einer cremigen Mandelsauce mit aromatischen Gewürzen und einem Hauch Kardamom.','Juicy lamb pieces gently braised in a creamy almond-based gravy with aromatic spices and a hint of cardamom.',{}],
    [128,['Lamm Gobhiwala','Lamb Gobhiwala'],'लैम्ब गोभीवाला',[7],'Zartes Lamm mit Blumenkohlröschen, gegart in einer würzigen Zwiebel-Tomaten-Sauce.','Tender lamb simmered with cauliflower florets in a spiced onion and tomato gravy.',{s:1}],
  ]},
  { id:'brot', de:'Brot', en:'Bread', hi:'रोटी', sub:['Frisch aus dem Tandoor – perfekt zum Tunken.','Fresh from the tandoor – perfect for dipping.'], items:[
    [129,'Tandoori Roti','तंदूरी रोटी',[1],'Fladenbrot aus Sauerteig, im Tandoor gebacken.','Sourdough flatbread baked in a tandoor.',{v:1},3.0],
    [130,['Chapati Ghee','Chapati Ghee / Phulka'],'चपाती',[1],'Vollkornfladenbrot, frisch gebacken und über offener Flamme aufgeblasen.','Whole wheat flour, freshly cooked and puffed over flame for a delicate, airy texture.',{v:1},3.5],
    [131,'Tandoori Butter Roti','',[1],'Gebuttertes Sauerteigbrot.','Buttered sourdough bread.',{v:1},3.5],
    [132,'Naan','नान',[1],'Fladenbrot aus feinstem Mehl.','Flatbread made from finest flour.',{v:1},3.5],
    [133,'Butter Naan','बटर नान',[1],'Gebuttertes Fladenbrot aus feinstem Mehl.','Buttered flatbread made from the finest flour.',{v:1},3.9],
    [134,'Garlic Naan','गार्लिक नान',[1],'Herzförmiges Fladenbrot mit Knoblauch.','Heart-shaped flatbread with garlic.',{v:1},4.9],
    [135,'Paratha Lachhedar','लच्छेदार पराठा',[1],'Speziell blättriges Brot aus Vollkornmehl, mit Butter gebacken.','Special flaky ring bread made from wholemeal flour baked with butter.',{v:1},5.5],
    [136,'Cheese Naan','',[1,7],'Fladenbrot gefüllt mit Käse.','Bread filled with cheese.',{v:1},5.5],
    [137,'Cheese Garlic Naan','',[1,7],'Fladenbrot gefüllt mit Käse und mit Knoblauch bestrichen.','Bread filled with cheese and brushed with garlic paste.',{v:1},6.5],
    [138,'Hara Naan','हरा नान',[1,7],'Fladenbrot gefüllt mit Erbsen und Käse.','Flatbread filled with green peas and homemade cheese.',{v:1},6.5],
    [139,'Keema Naan','कीमा नान',[1,7],'Fladenbrot gefüllt mit gehacktem Lammfleisch.','Flatbread stuffed with finely chopped lamb.',{},6.9],
    [140,'Peshwari Naan','पेशावरी नान',[1,7],'Fladenbrot, gefüllt mit einer zarten Mischung aus Kokosnuss, Mandeln, Rosinen und milden Gewürzen, leicht gebacken und mit Butter verfeinert.','Soft naan filled with a delicate blend of coconut, almonds, raisins and gentle spices, lightly baked and finished with butter.',{v:1},6.9],
    [141,'Paneer Paratha','पनीर पराठा',[1,7],'Weiches Paratha, gefüllt mit gewürztem Paneer, in der Pfanne goldbraun geröstet und mit Ghee verfeinert.','Soft paratha stuffed with spiced paneer, pan-roasted until golden and finished with ghee.',{v:1},7.9],
    [142,'Aloo Paratha','आलू पराठा',[1],'Weiches Paratha, gefüllt mit fein gewürzten Kartoffeln, in der Pfanne goldbraun gebraten und mit Ghee verfeinert.','Soft paratha stuffed with delicately spiced potatoes, pan-roasted until golden and finished with ghee.',{v:1},7.9],
    [143,'Crazy Naan','',[1,7],'Scharf gewürztes Fladenbrot.','Spicy flatbread.',{v:1,s:1},5.5],
  ]},
];
// drinks: [nr, name|[de,en], sizes [[size, price]], desc?|[de,en]]
const S24=['0,2','0,4'];
const DRINKS = [
  { de:'Wasser', en:'Water', items:[[1,['Mit Kohlensäure','Sparkling'],[['0,2',3.5],['0,7',6]]],[2,['Still','Still'],[['0,2',3.5],['0,7',6]]]] },
  { de:'Softdrinks', en:'Sodas', items:['Coca Cola','Coca Cola Zero','Sprite','Spezi','Fanta','Bitter Lemon','Tonic Water','Wildberry'].map((n,i)=>[i+3,n,[['0,2',2],['0,4',4]]]) },
  { de:'Nektar & Schorle', en:'Juices', note:['Rapps',''], items:[['Apfel','Apple'],['Maracuja','Passion fruit'],['Johannisbeere','Blackcurrant'],['Orange','Orange'],['Mango','Mango'],['Banane','Banana'],['Traube','Grape'],['Ananas','Pineapple'],['Guave','Guava']].map((n,i)=>[i+11,n,[['0,2',3.5],['0,4',4.5]]]) },
  { de:'Lassi', en:'Lassi', note:['Dhahi Handi','Dhahi Handi'], items:[
    [20,'Mango Lassi',[['0,2',3.5],['0,4',4.5]]],[21,'Bombay Lassi',[['0,4',4.5]]],[22,['Salziger Lassi','Salty Lassi'],[['0,4',4.5]]],
    [23,'Dry Fruit Lassi',[['0,4',6.5]]],[24,['Kokosnuss Lassi','Coconut Lassi'],[['0,4',4.5]]],[25,['Bananen Lassi','Banana Lassi'],[['0,4',5.5]]] ]},
  { de:'Bier', en:'Beer', items:[
    [26,'Kingfisher (Indien)',[['0,3',4.5]]],[27,'Pils',[['0,3',4.5],['0,5',5.5]]],[28,['Pils alkoholfrei','Alcohol-free Pils'],[['0,3',4.5]]],
    [29,['Weißbier / Hefe','Wheat beer'],[['0,5',5.5]]],[30,['Hefeweizen alkoholfrei','Alcohol-free wheat beer'],[['0,5',5.5]]],
    [31,'Radler',[['0,5',5.5]]],[32,'Colabier',[['0,5',5.5]]],[33,['Radler alkoholfrei','Alcohol-free Radler'],[['0,5',5.5]]] ]},
  { de:'Detox', en:'Detox', items:[
    [34,['Mint','Mint Me'],[['',6.5]]],[35,['Eistee','Ice Tea'],[['',6.5]],['Pfirsich / Zitrone','Peach / Lemon']],
    [36,'Narangi',[['',6.5]],['Maracuja, Orange, Mango, Soda','Passion fruit, orange, mango, soda']],
    [37,'Cucumba',[['',6.5]],['Gurke, Basilikum, Holunder, Zitrone, Soda','Cucumber, basil, elderflower, lemon, soda']],
    [38,'Jamuni',[['',6.5]],['Johannisbeere, Cranberry, Zitrone, Soda','Currant, cranberry, lemon, soda']] ]},
];
const PICKS = [117, 112, 134];

