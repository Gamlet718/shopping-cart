import { generateTemplate } from './generateTemplate.js'

// Функция получения данных и отрисовки карточек на главной странице
export async function getProducts() {
  try {
    const response = await fetch('http://localhost:5000/products')
    const data = await response.json()

    // Формируем нужный html для карточек
    generateTemplate(data)
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}

/**
 * Функция создания товара на главной странице
 * @param {string} productData.name - Название товара
 * @param {string} productData.category - Категория товара
 * @param {string} productData.rating - Рейтинг товара
 * @param {string} productData.price - Цена товара
 * @param {string} productData.imgSrc - Ссылка на изображение
 */
export async function createProduct(productData) {
  try {
    fetch('http://localhost:5000/products', {
      method: 'POST', // Здесь так же могут быть GET, PUT, DELETE
      // Тело запроса в JSON-формате
      body: JSON.stringify(productData),
      headers: {
        // Добавляем необходимые заголовки
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('созданная  сущность', data)
      })
  } catch (error) {
    console.error(error)
  }
}
