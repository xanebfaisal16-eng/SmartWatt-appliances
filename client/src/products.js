// const products = [
//     {
//         "id": 1,
//         "title": "Stainless Steel",
//         "images": "https://m.media-amazon.com/images/I/810-Z1ODvpL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/810-Z1ODvpL._AC_UY218_.jpg",
//         "price": "$35",
//         "Description": "Available in 3 colors",
//         "stock": 0,
//     },
//       {
//         "id": 2,
//         "title": "Popcorn Maker",
//         "images": "https://m.media-amazon.com/images/I/71ijvvCQU7L._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71ijvvCQU7L._AC_UY218_.jpg",
//         "price": "$789",
//         "Description": "high quality",
//         "stock": 0,
//     },

//     {
//         "id": "3",
//         "title": "Ninja| Air Fryer|",
//         "images": "https://m.media-amazon.com/images/I/71QwoGmcfUL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71QwoGmcfUL._AC_UY218_.jpg",
//         "price": "$27.9",
//         "Description": "high quality",
//         "stock": 12,
//     },
//     {
//         "id": 4,
//         "title": "CREAMi Ice Cream Maker",
//         "images": "https://m.media-amazon.com/images/I/71O-PzOILrL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71O-PzOILrL._AC_UY218_.jpg",
//         "price": "$567",
//         "Description": "Premium Quality",  
//      "stock": 12,
//     },
//     {
//         "id": 5,
//         "title": "Blender",
//         "images": "https://m.media-amazon.com/images/I/71UlX3f+4WL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71UlX3f+4WL._AC_UY218_.jpg",
//         "price": "$3.5",
//         "Description": "",
//         "stock": 12,
//     },

//     {
//         "id": 6,
//         "title": "Juicer Blender",
//         "images": "https://m.media-amazon.com/images/I/71iD5RyhuaL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71iD5RyhuaL._AC_UY218_.jpg",
//         "price": "$756",
//         "Description": "High-speed juicer blender with powerful motor and durable blades.",
//         "stock": 7
//     },
//     {
//         "id": 7,
//         "title": "CHEFMAN Multifunctional Digital Air Fryer",
//         "images": "https://m.media-amazon.com/images/I/71s8nikz44L._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71s8nikz44L._AC_UY218_.jpg",
//         "price": "$56.8",
//         "Description": "Digital air fryer for healthy, oil-free cooking with multiple presets.",
//         "stock": 10
//     },
//     {
//         "id": 8,
//         "title": "TurboBlaze Air Fryer 6 Qt",
//         "images": "https://m.media-amazon.com/images/I/81lTKYX5LNL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/81lTKYX5LNL._AC_UY218_.jpg",
//         "price": "$78",
//         "Description": "Large capacity air fryer with fast heat circulation and easy cleaning.",
//         "stock": 11
//     },
//     {
//         "id": 9,
//         "title": "Bella 2 Slice Slim Toaster",
//         "images": "https://m.media-amazon.com/images/I/71zZ0tSkfHL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71zZ0tSkfHL._AC_UY218_.jpg",
//         "price": "$24",
//         "Description": "Slim and compact toaster perfect for quick breakfasts.",
//         "stock": 1
//     },
//     {
//         "id": 10,
//         "title": "Ceiling Fans",
//         "images": "https://m.media-amazon.com/images/I/61tJoA+6vbL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/61tJoA+6vbL._AC_UY218_.jpg",
//         "price": "$50",
//         "Description": "Energy-efficient ceiling fan with strong airflow.",
//         "stock": 13
//     },
//     {
//         "id": 11,
//         "title": "Kitchen Mama Mini Electric Can Opener",
//         "images": "https://m.media-amazon.com/images/I/51TUPNgJN8L._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/51TUPNgJN8L._AC_UY218_.jpg",
//         "price": "$5",
//         "Description": "Compact electric can opener for easy hands-free use.",
//         "stock": 12
//     },
//     {
//         "id": 12,
//         "title": "Motor Kit",
//         "images": "https://m.media-amazon.com/images/I/71yaE1Tf9IL._AC_SY300_SX300_QL70_FMwebp_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71yaE1Tf9IL._AC_SY300_SX300_QL70_FMwebp_.jpg",
//         "price": "$7",
//         "Description": "DIY motor kit suitable for school projects and experiments.",
//         "stock": 12
//     },
//     {
//         "id": 13,
//         "title": "Compressor Motor",
//         "images": "https://m.media-amazon.com/images/I/712qRYfmGZL._AC_UL320_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/712qRYfmGZL._AC_UL320_.jpg",
//         "price": "$78",
//         "Description": "High-performance compressor motor for heavy-duty use.",
//         "stock": 12
//     },
//     {
//         "id": 14,
//         "title": "Electric Motor Air",
//         "images": "https://m.media-amazon.com/images/I/51MUuiqFaRL._AC_UL320_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/51MUuiqFaRL._AC_UL320_.jpg",
//         "price": "$43",
//         "Description": "Durable electric air motor with long working life.",
//         "stock": 12
//     },
//     {
//         "id": 15,
//         "title": "2HP Electric Motor",
//         "images": "https://m.media-amazon.com/images/I/71nVipIgbaL._AC_UL320_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71nVipIgbaL._AC_UL320_.jpg",
//         "price": "$10",
//         "Description": "Powerful 2HP motor suitable for industrial applications.",
//         "stock": 12
//     },
//     {
//         "id": 16,
//         "title": "Pack of 2 DC 3V Motors",
//         "images": "https://m.media-amazon.com/images/I/61r7qjuS8wL._AC_UL320_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/61r7qjuS8wL._AC_UL320_.jpg",
//         "price": "$3",
//         "Description": "Small DC motors ideal for robotics and small devices.",
//         "stock": 12
//     },
//     {
//         "id": 17,
//         "title": "Magnet DC Motor",
//         "images": "https://m.media-amazon.com/images/I/61xSXBIfwbL._AC_UL320_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/61xSXBIfwbL._AC_UL320_.jpg",
//         "price": "$23",
//         "Description": "Magnetic DC motor with smooth and silent operation.",
//         "stock": 12
//     },
//     {
//         "id": 18,
//         "title": "Creamy Ice-cream Maker",
//         "images": "https://m.media-amazon.com/images/I/71jM94aB4rL._AC_SL1500_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71jM94aB4rL._AC_SL1500_.jpg",
//         "price": "$45",
//         "Description": "Easy-to-use ice cream maker for making fresh desserts.",
//         "stock": 12
//     },
//     {
//         "id": 19,
//         "title": "Dual AEDIKO TT Motor",
//         "images": "https://m.media-amazon.com/images/I/71KedmnCaTL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71KedmnCaTL._AC_UY218_.jpg",
//         "price": "$11",
//         "Description": "Dual TT motor set designed for robotics and car toys.",
//         "stock": 12
//     },
//     {
//         "id": 20,
//         "title": "EUADAX 465pcs DC Motor Kit",
//         "images": "https://m.media-amazon.com/images/I/71lSzBlDRRL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71lSzBlDRRL._AC_UY218_.jpg",
//         "price": "$4",
//         "Description": "Complete motor kit with accessories for DIY projects.",
//         "stock": 12
//     },
//     {
//         "id": 21,
//         "title": "Eudax Mini Generator",
//         "images": "https://m.media-amazon.com/images/I/71rJMcqJbSL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71rJMcqJbSL._AC_UY218_.jpg",
//         "price": "$16",
//         "Description": "Small generator perfect for school science activities.",
//         "stock": 12
//     },
//     {
//         "id": 22,
//         "title": "Midea WHS-87LB1 Refrigerator",
//         "images": "https://m.media-amazon.com/images/I/612pjRLn+nL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/612pjRLn+nL._AC_UY218_.jpg",
//         "price": "$45",
//         "Description": "Compact refrigerator ideal for small rooms and offices.",
//         "stock": 12
//     },
//     {
//         "id": 23,
//         "title": "Mini Fridge",
//         "images": "https://m.media-amazon.com/images/I/61RQ6Dd5nlL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/61RQ6Dd5nlL._AC_UY218_.jpg",
//         "price": "$45",
//         "Description": "Portable mini fridge for drinks and skincare items.",
//         "stock": 12
//     },
//     {
//         "id": 24,
//         "title": "Car Fridge",
//         "images": "https://m.media-amazon.com/images/I/7103sH8aruL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/7103sH8aruL._AC_UY218_.jpg",
//         "price": "$56",
//         "Description": "Portable car refrigerator ideal for travel and camping.",
//         "stock": 12
//     },
//     {
//         "id": 25,
//         "title": "Black-Decker Water Bottle",
//         "images": "https://m.media-amazon.com/images/I/71mdnGqPvIL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71mdnGqPvIL._AC_UY218_.jpg",
//         "price": "$234",
//         "Description": "Insulated water bottle with premium build quality.",
//         "stock": 12
//     },
//      {
//         "id": 25,
//         "title": "Black-Decker Water Bottle",
//         "images": "https://m.media-amazon.com/images/I/71mdnGqPvIL._AC_UY218_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/71mdnGqPvIL._AC_UY218_.jpg",
//         "price": "$234",
//         "Description": "Insulated water bottle with premium build quality.",
//         "stock": 12
//     },
//     {
//         "id": 27,
//         "title": "Fireplace TV Stand",
//         "images": "https://m.media-amazon.com/images/I/61NsjDyNEKL._AC_UL320_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/61NsjDyNEKL._AC_UL320_.jpg",
//         "price": "$567",
//         "Description": "Modern TV stand with built-in electric fireplace.",
//         "stock": 12
//     },
//     {
//         "id": 28,
//         "title": "Electric Fireplace Heater",
//         "images": "https://m.media-amazon.com/images/I/81CfZ0kpw6L._AC_UL320_.jpg",
//         "thumbnailimages": "https://m.media-amazon.com/images/I/81CfZ0kpw6L._AC_UL320_.jpg",
//         "price": "$90",
//         "Description": "Portable electric heater with realistic fireplace display.",
//         "stock": 12
//     },

//     {
//        "id": 29,
//   "title": "Portable BBQ Grill Heater",
//   "images": "https://m.media-amazon.com/images/I/61jMKPM1C+L._AC_UL320_.jpg",
//   "price": "$120",
//   "Description": "2-in-1 Heater with built-in BBQ grill, perfect for outdoor cooking.",
//   "stock": 12,
//   "brand": "HeatGrill",
//   "rating": 4.6,
//   "category": "Outdoor Appliances"
// },

   
// ]
// export default products