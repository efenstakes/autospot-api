// const fetch = require('node-fetch')
import fetch from 'node-fetch';


const SERVER_URL = "http://localhost:1234/graph"


export const getRandomFloat = (min, max)=> {
  return Math.random() * (max - min + 1) + min;
}

export const getRandominteger = (min, max)=> {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

export const getRandomElem = (array)=> {
  const num = Math.floor(Math.random() * (array.length - 1) ) + 0;
  return array[num]
}

export const getRandomElems = (array, num) => {
  let arr = []

  for (var i = 0; i < num; i++) {
      const rand_i = getRandominteger(0, (array.length-1))
      arr.push( array[rand_i] )
  }

  return arr
}



const carBrandsAndModels = [
  {
    brand: "Toyota",
    models: ["Corolla", "Camry", "RAV4", "Highlander", "Tacoma"]
  },
  {
    brand: "Honda",
    models: ["Civic", "Accord", "CR-V", "Pilot", "Fit"]
  },
  {
    brand: "Ford",
    models: ["F-150", "Focus", "Mustang", "Escape", "Explorer"]
  },
  {
    brand: "Chevrolet",
    models: ["Silverado", "Cruze", "Malibu", "Equinox", "Traverse"]
  },
  {
    brand: "Nissan",
    models: ["Altima", "Maxima", "Rogue", "Murano", "Sentra"]
  },
  {
    brand: "Volkswagen",
    models: ["Golf", "Jetta", "Passat", "Tiguan", "Atlas"]
  },
  {
    brand: "BMW",
    models: ["3 Series", "5 Series", "X3", "X5", "7 Series"]
  },
  {
    brand: "Mercedes-Benz",
    models: ["C-Class", "E-Class", "S-Class", "GLC", "GLE"]
  },
  {
    brand: "Audi",
    models: ["A3", "A4", "A6", "Q3", "Q5"]
  },
  {
    brand: "Kia",
    models: ["Forte", "Optima", "Sorento", "Sportage", "Telluride"]
  },
  {
    brand: "Hyundai",
    models: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona"]
  },
  {
    brand: "Mazda",
    models: ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5 Miata"]
  },
  {
    brand: "Subaru",
    models: ["Impreza", "Outback", "Forester", "Crosstrek", "Legacy"]
  },
  {
    brand: "Jeep",
    models: ["Wrangler", "Cherokee", "Grand Cherokee", "Renegade", "Compass"]
  },
  {
    brand: "Lexus",
    models: ["ES", "GS", "RX", "NX", "LS"]
  },
  // ... (continue adding more brands and models)
]

                   
// parts
const Parts = [ "Front Bumper", "Front Lights", "Rear Bumper", "Rear Lights", ]

const years = Array.from({ length: 17 }, (_, i)=> new Date().getFullYear() - i)
const addProducts = async (products)=> {
  const brands = carBrandsAndModels.map((b)=> b.brand)
  
  for (const part of Parts) {

    for (const brand of brands) {
      const models = carBrandsAndModels.find((b)=> b.brand == brand).models

    
      for (const model of models) {
        const basePrice = getRandominteger(50000, 150000)

        const product = {
          name: part,
          brand,
          model,
          years: getRandomElems(years, getRandominteger(1, 5)),
          variants: [
            {
              name: "Standard",
              price: basePrice,
              image: "https://yoda-ai.s3.amazonaws.com/std.jpeg",
            },
            {
              name: "Modified",
              price: basePrice + 12000,
              image: "https://yoda-ai.s3.amazonaws.com/mod.jpeg",
            },
          ],
          deliveryDays: 10,
        }

        console.log("product ", product);
        await addProduct(product)
      }
    }
  }
}
// const addProducts = async (products)=> {
//   let index = 0

//     setInterval(async ()=> {
//       await addProduct(products[index]);
//       index++
//     }, 100)
// }


// _id
// description
// availableBrands
// category
// subCategory
// deliveryDays

const ADD_PRODUCT = `
    mutation createProduct(
      $name: String!,
      $description: String
      $brand: String!,
      $model: String!,
      $years: [Int]!,
      $variants: [ProductInputTypeVariant],
      $deliveryDays: Int!
    ) {

        createProduct(
          name: $name,
          description: $description,
          brand: $brand,
          model: $model,
          years: $years,
          variants: $variants,
          deliveryDays: $deliveryDays
        ) {
            
            _id
            name
            
        }
    }
`
const addProduct = async (data)=> {

    console.log('====================================');
    console.log("add product ", data);
    console.log('====================================');
    try {
        const req = await fetch(
            SERVER_URL,
            {
                method: 'POST',

                body: JSON.stringify({
                    query: ADD_PRODUCT,
                    variables: {
                        ...data,
                        discount: 0,
                    }
                }),

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            },
        )
    
        const response = await req.json()
        console.log('====================================');
        console.log("response ", response);
        console.log('====================================');
    } catch(e) {

        console.log('====================================');
        console.log("error ", e );
        console.log('====================================');
    }
}



// _id: ID
// name: String
// description: String
// brand: String
// price: Float
// discount: Float
// category: String
// subCategory: String
// deliveryDays: Int


// const prices = [ 10000, 20000, 25000, 50000, 50000, 40000, 45000 ]

// const products =  carBrandsAndModels.flatMap(({ brand, models })=> {

//   return models.flatMap((model)=> {


//     return carParts.flatMap(({ location, ...rest })=> {
//       const price = prices[Math.floor(Math.random() * prices.length)]
  
//       return [ 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023 ].flatMap((year)=> {
  
//         return { ...rest, price, brand, year, model, }
//       })
//     })
//   })
// })

// console.log("add products ", products)

addProducts([])
    .then((res)=> {

        console.log('====================================');
        console.log(" res ", res);
        console.log('====================================');
    })
    .catch((error)=> {

        console.log('====================================');
        console.log(" error ", error);
        console.log('====================================');
    })

