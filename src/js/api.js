import { generateTemplate } from './generateTemplate.js'
import { SELECTORS } from './selectors.js'

// массив для добавления карточек
const cart = []


// Начальное цифра в кружочке корзины
SELECTORS.basketTotalValue.textContent = 0

/**
 * Функция получения данных и отрисовки карточек на главной странице
 */
export async function getProducts() {
  try {
    const response = await fetch('http://localhost:5000/products')
    const data = await response.json()

    // Формируем нужный html для карточек
    generateTemplate(data)
    // Функция для формирования карточки при нажати на кнопку "Добавить"
    function addEventListenersToButtons() {
      const addButtons = document.querySelectorAll('.btn-primary')
      // Цикл по всем кнопкам и функция клика при нажати
      addButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const productElement = button.closest('.main-card')
          const productId = productElement.getAttribute('data-id')

          // Создание константы
          const product = {
            id: productId,
            name: productElement.querySelector('h3').textContent,
            category: productElement.querySelector('.card-category').textContent,
            rating: productElement.querySelector('.rating-amount').textContent,
            price: productElement.querySelector('.card-price').textContent,
            imgSrc: productElement.querySelector('img').src,
          }
          addToCart(product)
          displayProductsInModal(cart)
          console.log('Товар добавлен в корзину:', product)
        })
      })
    }
    addEventListenersToButtons()
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}


// Функция добавления карточек в массив с условияем недобавление повторной карточки, и показ сообщения
function addToCart(product) {
  if (!cart.some((item) => item.id === product.id)) {
    cart.push(product)
    showMessage(`${product.name} добавлен в корзину!`)
  } else {
    showMessage(`${product.name} уже в корзине!`)
  }
  updateCartUI()
}


// Функция расчета количество карточек
function updateCartUI() {
  SELECTORS.basketTotalValue.textContent = cart.length
}

/**
 * Функция для отображения сообщения
 * @param {string} message - текст сообщения- 
 */
function showMessage(message) {
  const messageBox = document.createElement('div')
  messageBox.classList.add('message-box')
  messageBox.innerText = message

  document.body.appendChild(messageBox)

  // Удаляем сообщение через 1 секунду
  setTimeout(() => {
    messageBox.remove()
  }, 1000)
}
/**
 * 
 * @param {object} product - Объект для отрисовки в HTML 
 * @returns Возвращаем готовый элемент HTML 
 */
function createProductCard(product) {
  // Создаем элементы карточки
  const card = document.createElement('div')
  card.classList.add('product-card')
  card.setAttribute('id', product.id)
  card.style.position = 'relative'

  // Добавление фотографии, и стилей для нее 
  const img = document.createElement('img')
  img.src = product.imgSrc
  img.alt = product.name
  img.width = 200
  img.height = 150

  // Имя Карточки
  const name = document.createElement('h3')
  name.innerText = product.name

  // Категория Карточки
  const category = document.createElement('p')
  category.classList.add('card-category')
  category.innerText = `Category: ${product.category}`

  // Рейтинг Карточки
  const rating = document.createElement('p')
  rating.classList.add('rating-category')
  rating.innerText = `Rating: ${product.rating}`

  // Цена Карточки
  const price = document.createElement('p')
  price.classList.add('card-price')
  price.innerText = `Price: ${product.price}`

  // Крестик для удаления Карточки
  const close = document.createElement('span')
  close.classList.add('close')
  close.style.cursor = 'pointer'
  close.style.color = 'red'
  close.style.fontSize = '40px'
  close.style.position = 'absolute'
  close.style.top = '5px'
  close.style.right = '10px'
  close.innerHTML = '&times;'

  // Добавляем все элементы в карточку
  card.appendChild(img)
  card.appendChild(name)
  card.appendChild(category)
  card.appendChild(rating)
  card.appendChild(price)
  card.appendChild(close)

  card.style.margin = '10px' // Устанавливаем отступы
  card.style.padding = '15px' // Устанавливаем внутренние отступы
  card.style.border = '1px solid #ccc' // Устанавливаем рамку
  card.style.borderRadius = '5px' // Скругляем углы

  return card
}

/**
 * Функция для отображения всех продуктов в модалке, расчета стоимости и удаления карточек
 * @param {Array} cart - массив добавленных нами карточек
 */
function displayProductsInModal(cart) {
  SELECTORS.modalBody

  // Очищаем модальное тело перед добавлением новых карточек
  SELECTORS.modalBody.innerHTML = ''

  // Создаем элемент для отображения общей суммы
  const totalAmount = document.createElement('h2')
  totalAmount.classList.add('totalAmount')
  totalAmount.innerText = `TOTAL: $${calculateTotal(cart)}`

  // Добавляем наш элемент в структуру 
  SELECTORS.modalBody.appendChild(totalAmount)

  // Перебираем массив cart и создаем карточки для каждого продукта
  cart.forEach((product) => {
    const productCard = createProductCard(product)
    SELECTORS.modalBody.appendChild(productCard)
  })

  // Создаем Константанту для крестика (удаления товара)
  const close = document.querySelectorAll('.close')

  // Цикл по всем крестикам и удаления нужной карты из массивы cart
  close.forEach((cross) => {
    cross.addEventListener('click', () => {
      cross.parentElement.remove()
      const index = cart.findIndex((element) => element.id === cross.parentElement.id)
      if (index !== -1) {
        cart.splice(index, 1)
      }
      // Обновления суммы и количество товаров в корзине
      totalAmount.innerText = `TOTAL: $${calculateTotal(cart)}`
      SELECTORS.basketTotalValue.textContent = cart.length
    })
  })
}

// Функция для расчета общей суммы
function calculateTotal(cart) {
  let count = 0
  cart.forEach((num) => {
    count += parseInt(num.price)
  })
  return count
}

SELECTORS.openBasketButton.addEventListener('click', () => {
  SELECTORS.modalBasket.showModal() // Открываем модальное окно
})

// Закрываем модалку при нажатии на кнопку "Закрыть"
SELECTORS.closeButton.addEventListener('click', () => {
  SELECTORS.modalBasket.close() // Закрываем модальное окно
})
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
