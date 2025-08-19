import type { Product } from "~/composables/types/product";

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const perPage = Number.parseInt((query.perPage as string) || '5', 10)
  const page = Number.parseInt((query.page as string) || '1', 10)
  const filter = (query.filter as string) || ''

  if (perPage >= 50) {
    // Create an artificial delay
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const data = await getDemoData()
  const offset = (page - 1) * perPage
  const filterRe = new RegExp(filter, 'i')

  return {
    total: data.length,
    data: !filter
      ? data.slice(offset, offset + perPage)
      : data
          .filter((item) => {
            return [item.name, item.sku].some(item => item.match(filterRe))
          })
          .slice(offset, offset + perPage),
  }
})

async function getDemoData(): Promise<Product[]> {
  // ใช้เวลา build ชุดข้อมูล จากของเดิม + ใส่ฟิลด์ใหม่
  const now = new Date().toISOString()
  const base = [
    { id: 0,  name: 'Gray couch',         price: 2499.99, image: '/img/products/furniture-1.svg',  sku: 'FC-59859' },
    { id: 1,  name: 'Clay style sofa',    price: 1999.99, image: '/img/products/furniture-2.svg',  sku: 'FC-15984' },
    { id: 2,  name: 'Victorian armchair', price:  899.99, image: '/img/products/furniture-3.svg',  sku: 'FC-48668' },
    { id: 3,  name: 'Relaxed sofa',       price: 1499.99, image: '/img/products/furniture-4.svg',  sku: 'FC-75549' },
    { id: 4,  name: 'Flat gray sofa',     price: 1649.99, image: '/img/products/furniture-5.svg',  sku: 'FC-45654' },
    { id: 5,  name: 'Cosy flat couch',    price: 1449.49, image: '/img/products/furniture-6.svg',  sku: 'FC-81155' },
    { id: 6,  name: 'Simple sofa',        price:  999.99, image: '/img/products/furniture-7.svg',  sku: 'FC-15898' },
    { id: 7,  name: 'Emperor couch',      price: 2999.99, image: '/img/products/furniture-8.svg',  sku: 'FC-41599' },
    { id: 8,  name: 'Minimalist couch',   price: 1299.99, image: '/img/products/furniture-9.svg',  sku: 'FC-16945' },
    { id: 9,  name: 'Lazyboy sofa',       price:  899.99, image: '/img/products/furniture-10.svg', sku: 'FC-84165' },
    { id: 10, name: 'Monastic chair',     price: 2499.00, image: '/img/products/furniture-11.svg', sku: 'FC-59859-2' },
    { id: 11, name: 'Roman style couch',  price: 2499.00, image: '/img/products/furniture-12.svg', sku: 'FC-47988' },
    { id: 12, name: 'Cosy Armchair',      price: 3499.99, image: '/img/products/furniture-13.svg', sku: 'FC-12654' },
    { id: 13, name: 'Compact couch',      price:  549.99, image: '/img/products/furniture-14.svg', sku: 'FC-23559' },
    { id: 14, name: 'Cosy wine chair',    price: 1299.99, image: '/img/products/furniture-15.svg', sku: 'FC-11568' },
    { id: 15, name: 'Modern sofa',        price:  999.99, image: '/img/products/furniture-16.svg', sku: 'FC-78589' },
    { id: 16, name: 'Modern armchair',    price: 1499.99, image: '/img/products/furniture-17.svg', sku: 'FC-154489' },
    { id: 17, name: 'Curvy sofa',         price:  899.99, image: '/img/products/furniture-18.svg', sku: 'FC-41589' },
    { id: 18, name: 'Classy sofa',        price: 1799.99, image: '/img/products/furniture-19.svg', sku: 'FC-15659' },
    { id: 19, name: 'Laydown sofa',       price: 1299.99, image: '/img/products/furniture-20.svg', sku: 'FC-11568-2' },
  ] as const

  // กระจาย vat_type ให้ดูหลากหลาย (include/exclude/exempt) และกำหนด vat_rate ให้เหมาะสม
  const pickVatType = (i: number): Product['vat_type'] =>
    i % 5 === 0 ? 'exempt' : i % 2 === 0 ? 'include' : 'exclude'

  const pickVatRate = (t: Product['vat_type']) => (t === 'exempt' ? 0 : 7)

  const products: Product[] = base.map((p) => {
    const vat_type = pickVatType(p.id)
    const vat_rate = pickVatRate(vat_type)
    return {
      id: p.id,
      store_id: 'store_001',         // ปรับตามระบบของคุณ
      sku: p.sku,
      name: p.name,
      price: p.price,
      vat_type,
      vat_rate,
      created_at: now,
      updated_at: now,
      product_image: {
        id: p.id,
        product_id: p.id,
        url: p.image,
      },
    }
  })

  return Promise.resolve(products)
}