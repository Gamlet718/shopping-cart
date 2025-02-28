import { createProduct, getProducts } from './api.js'
import { SELECTORS } from './selectors.js'

init()

function init() {
  // подгрузка данных при загрузке страницы
  window.addEventListener('DOMContentLoaded', () => {
    getProducts()
    submitForm()
  })
}

// Обработчик формы
function submitForm() {
  SELECTORS?.form?.addEventListener('submit', (event) => {
    event?.preventDefault()

    // Новый товар
    const productData = {}

    Array?.from(SELECTORS?.form?.elements)?.forEach((element) => {
      if (element?.name) {
        productData[element.name] = element.value
      }
    })

    // Функция создания нового товара
    createProduct(productData)

    // Показ актуальных данных
    getProducts()
  })
}
