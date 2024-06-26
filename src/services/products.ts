import ProductsModel from "../models/products";


const getAllItems = async () => {
  // const responseItem = await ProductsModel.find({});

  const responseItem = [

    {
      id: 1,
      imagen: "ensalada_cesar.png",
      name: "CÉSAR",
      description: "Lechuga, rúcula, pollo rebozado, picatostes, queso parmesano en escamas, salsa césar y bacon crujiente.",
      category: "Ensaladas",
      price: 9.90
    },
    {
      id: 2,
      name: "CABRA",
      imagen: "ensalada_cabra.png",
      description: "Lechuga, rúcula, queso de rulo de cabra, tomate cherry, cóctel de frutos secos y crema balsámica.",
      category: "Ensaladas",
      price: 8.90
    },
    {
      id: 3,
      name: "PRIME",
      description: "Mezclum de ensalada variada, tomate cherry, queso parmesano en escamas, cóctel de frutos secos, arándanos, cebolla crujiente, bacon crujiente, un toque de vinagre de módena y crema balsámica",
      category: "Ensaladas",
      price: 8.90
    },
    {
      id: 4,
      name: "PIPARRAS",
      imagen: "entrantes_piparras.png",
      description: "Guindillas en tempura con una salsa teriyaki y caviar de chili.",
      category: "Entrantes",
      price: 8.90
    },
    {
      id: 5,
      name: "POTATO RANCHER",
      description: "Patatas gratinadas con queso rallado, bacon y salsa ranchera. Opción: EXTRA de cebolla crujiente",
      category: "Entrantes",
      price: 9.90
    },
    {
      id: 6,
      name: "NACHOS PRIME",
      imagen: "entrantes_nachos.png",
      description: "Nachos con una base de salsa de queso cheddar, gratinado con queso rallado y cochinita pibil, guacamole, salsa de ajo y yogurt y jalapeños en rodajas por encima.",
      category: "Entrantes",
      price: 10.90
    },
    {
      id: 7,
      name: "CHICKEN FINGERS",
      imagen: "entrantes_chicken_fingers.png",
      description: "Tiras de pollo rebozadas acompañadas con una salsa de ajo y cebolla caramelizada. (6 UNDS)",
      category: "Entrantes",
      price: 8.90
    },
    {
      id: 8,
      name: "CHEESE FINGERS",
      imagen: "entrantes_cheese_fingers.png",
      description: "Fingers de queso mozzarella rebozados y acompañados con mermelada de tomate. (6 UNDS)",
      category: "Entrantes",
      price: 6.90
    },
    {
      id: 9,
      name: "ARITOS DE CEBOLLA",
      imagen: "entrantes_aritos_de_cebolla.png",
      description: "Aros de cebolla rebozados y acompañados con salsa barbacoa. (6 UNDS)",
      category: "Entrantes",
      price: 4.90
    },
    {
      id: 10,
      name: "ALITAS THAI",
      imagen: "entrantes_alitas_thai.png",
      description: "Alitas de pollo crujientes maceradas con salsa thai y decoradas con cebollino. (5 UNDS)",
      category: "Entrantes",
      price: 9.90
    },
    {
      id: 11,
      name: "CROQUETAS",
      imagen: "entrantes_croquetas.png",
      description: "Croquetas de jamón/cabrales.",
      category: "Entrantes",
      price: 1.90
    },
    {
      id: 12,
      name: "CABRAMELIZADA",
      description: "Pan brioche, 180g de carne de 100% angus, queso de rulo de cabra, cebolla caramelizada, rúcula y mermelada de tomate.",
      category: "Burger's Prime",
      price: 12.90
    },
    {
      id: 13,
      name: "ARIZONA TRUFADA",
      description: "Pan brioche, 180g de carne de vaca madurada nacional (Arizona), queso cheddar, bacon ahumado, cebolla dulce frita y salsa mayo trufada.",
      category: "Burger's Prime",
      price: 11.90
    },
    {
      id: 14,
      name: "ANGUS BURGER",
      description: "Pan brioche, 180g de carne de 100% angus, queso cheddar, queso eddam, bacon ahumado, cebolla dulce frita, hoja de roble y salsa de la casa.",
      category: "Burger's Prime",
      price: 12.90
    },
    {
      id: 15,
      name: "ARIZONA BURGER",
      description: "Pan brioche, 180g de carne de vaca madurada nacional (Arizona), queso cheddar, bacon ahumado, cebolla morada frita, hoja de roble y salsa de la casa.",
      category: "Burger's Prime",
      price: 12.90
    },
    {
      id: 16,
      name: "CRISPY CHICKEN",
      description: "Pan crujiente, pechuga de pollo rebozada, queso cheddar, cebolla morada en rodaja, tomate, hoja de roble y salsa cajún.",
      category: "Burger's Prime",
      price: 9.90
    },
    {
      id: 17,
      name: "VEGAN BURGER",
      description: "Pan crujiente, carne 100% vegetal, pepinillo, cebolla morada en rodaja, tomate, hoja de roble y salsa cajún.",
      category: "Burger's Prime",
      price: 10.90
    },
    {
      id: 18,
      name: "ORIGINAL SMASH",
      description: "Pan brioche, 180g de carne smasheada, queso cheddar, queso eddam, bacon ahumado, cebolla morada frita, pepinillo, hoja de roble y salsa de la casa.",
      category: "Smash Burger's",
      price: 11.90
    },
    {
      id: 19,
      name: "OKLAHOMA",
      description: "Pan de brioche, 180g de carne smasheada con cebolla blanca, queso cheddar, pepinillo y salsa de la casa.",
      category: "Smash Burger's",
      price: 11.90
    },
    {
      id: 20,
      name: "PRIME RANCHER",
      description: "Pan brioche, 180g de carne smasheada, patatas con salsa ranchera, bacon ahumado, cebolla crujiente y doble de queso cheddar.",
      category: "Smash Burger's",
      price: 12.90
    },
    {
      id: 21,
      name: "SMASH DORITOS",
      description: "Pan brioche con queso queddar derretido por encima, 180gr de carne smasheada, queso eddam, queso rebozado en doritos y salsa cheddar jalapeño.",
      category: "Smash Burger's",
      price: 12.90
    },
    {
      id: 22,
      name: "SMASH ONIONS",
      description: "Pan brioche, 180g de carne smasheada, queso cheddar, cebolla caramelizada, cebolla crujiente, aros de cebolla y salsa barbacoa.",
      category: "Smash Burger's",
      price: 12.90
    },
    {
      id: 23,
      name: "COULANT DE CHOCOLATE",
      imagen: "postres_coulant_de_chocolate.png",
      description: "Coulant de chocolate caliente acompañado de sirope de chocolate blanco y galleta lotus espolvoreada.",
      category: "Postres",
      price: 5.90
    },
    {
      id: 24,
      name: "CHEESE CAKE",
      imagen: "postres_cheesecake.png",
      description: "Tarta de queso con arándanos espolvoreada con galleta de lotus molida.",
      category: "Postres",
      price: 6.90
    },
    {
      id: 25,
      name: "AGUA PEQUEÑA",
      imagen: "bebidas_botella_de_agua_pequeña.png",
      category: "Bebidas",
      price: 1.10
    },
    {
      id: 26,
      name: "AGUA GRANDE",
      imagen: "bebidas_botella_de_agua_grande.png",
      category: "Bebidas",
      price: 1.60
    },
    {
      id: 27,
      name: "COCACOLA",
      imagen: "bebidas_cocacola.png",
      category: "Bebidas",
      price: 2.00
    },
    {
      id: 28,
      name: "COCACOLA ZERO",
      imagen: "bebidas_cocacola_zero.png",
      category: "Bebidas",
      price: 2.10
    },
    {
      id: 29,
      name: "COCACOLA ZERO ZERO",
      imagen: "bebidas_cocacola_zero_zero.png",
      category: "Bebidas",
      price: 2.20
    },
    {
      id: 30,
      name: "FANTA DE LIMÓN",
      imagen: "bebidas_fanta_de_limon.png",
      category: "Bebidas",
      price: 2.00
    },
    {
      id: 31,
      name: "FANTA DE NARANJA",
      imagen: "bebidas_fanta_de_naranja.png",
      category: "Bebidas",
      price: 2.00
    },
    {
      id: 32,
      name: "AQUARIUS LIMÓN",
      imagen: "bebidas_aquarius_de_limon.png",
      category: "Bebidas",
      price: 2.00
    },
    {
      id: 33,
      name: "NESTEA",
      imagen: "bebidas_nestea.png",
      category: "Bebidas",
      price: 2.00
    },
    {
      id: 34,
      name: "TÓNICA BLISS",
      imagen: "bebidas_tonica_bliss.png",
      category: "Bebidas",
      price: 2.20
    },
    {
      id: 35,
      name: "CAÑA ÁGUILA",
      imagen: "bebidas_caña_aguila.png",
      category: "Bebidas",
      price: 1.50
    },
    {
      id: 36,
      name: "JARRA ÁGUILA",
      imagen: "bebidas_jarra_aguila.png",
      category: "Bebidas",
      price: 2.00
    },
    {
      id: 37,
      name: "TANQUE ÁGUILA",
      imagen: "bebidas_tanque_aguila.png",
      category: "Bebidas",
      price: 2.50
    },
    {
      id: 38,
      name: "CAÑA TINTO DE VERANO",
      imagen: "bebidas_caña_tinto_de_verano.png",
      category: "Bebidas",
      price: 1.60
    },
    {
      id: 39,
      name: "JARRA TINTO DE VERANO",
      category: "Bebidas",
      price: 2.10
    },
    {
      id: 40,
      name: "TANQUE TINTO DE VERANO",
      category: "Bebidas",
      price: 2.60
    },
    {
      id: 41,
      name: "TERCIO HEINEKEN 0,0",
      category: "Bebidas",
      price: 2.40
    },
    {
      id: 42,
      name: "TERCIO AMSTEL ORO 0,0",
      category: "Bebidas",
      price: 2.40
    },
    {
      id: 43,
      name: "TERCIO AMSTEL RADLER",
      category: "Bebidas",
      price: 2.50
    },
    {
      id: 44,
      name: "TERCIO AMSTEL ORO",
      category: "Bebidas",
      price: 2.60
    },
    {
      id: 45,
      name: "TERCIO ÁGUILA SIN FILTRAR",
      category: "Bebidas",
      price: 2.60
    }
    
  ];


  return responseItem;
};

const getTrending = async () => {

//  const responseItem = await ProductsModel.findOne({});

const responseItem = [

    {
      id: 1,
      imagen: "https://img.pikbest.com/origin/09/19/47/17kpIkbEsTA6I.png!w700wp",
      name: "CÉSAR",
      description: "Lechuga, rúcula, pollo rebozado, picatostes, queso parmesano en escamas, salsa césar y bacon crujiente.",
      category: "Ensaladas",
      price: 9.90
    },
    {
      id: 2,
      name: "CABRA",
      imagen: "https://mimaflor.es/wp-content/uploads/2022/05/plato-queso-de-cabra-web.png.webp",
      description: "Lechuga, rúcula, queso de rulo de cabra, tomate cherry, cóctel de frutos secos y crema balsámica.",
      category: "Ensaladas",
      price: 8.90
    },
    {
      id: 3,
      name: "PRIME",
      description: "Mezclum de ensalada variada, tomate cherry, queso parmesano en escamas, cóctel de frutos secos, arándanos, cebolla crujiente, bacon crujiente, un toque de vinagre de módena y crema balsámica",
      category: "Ensaladas",
      price: 8.90
    },
    {
      id: 4,
      name: "PIPARRAS",
      imagen: "https://mellerware.com/cdn/shop/articles/38._Piparras_-_FOTO_1_1400x.jpg?v=1658850037",
      description: "Guindillas en tempura con una salsa teriyaki y caviar de chili.",
      category: "Entrantes",
      price: 8.90
    },
    {
      id: 5,
      imagen: "https://hips.hearstapps.com/hmg-prod/images/ranch-potatoes-recipe-1-6414b8eb27bb0.jpg?crop=1xw:1xh;center,top&resize=1200:*",
      name: "POTATO RANCHER",
      description: "Patatas gratinadas con queso rallado, bacon y salsa ranchera. Opción: EXTRA de cebolla crujiente",
      category: "Entrantes",
      price: 9.90
    },
    {
      id: 6,
      name: "NACHOS PRIME",
      imagen: "https://assets.tmecosys.com/image/upload/t_web667x528/img/recipe/ras/Assets/7695121e-8b9a-4d00-ab96-4430e47266ba/Derivates/445ffdd9-9a8e-48fa-9e86-84c1e94469ca.jpg",
      description: "Nachos con una base de salsa de queso cheddar, gratinado con queso rallado y cochinita pibil, guacamole, salsa de ajo y yogurt y jalapeños en rodajas por encima.",
      category: "Entrantes",
      price: 10.90
    },
  ];

  return responseItem;
};


export { getAllItems, getTrending };
