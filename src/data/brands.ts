export interface Brand {
  id: string
  name: string
  category: string
  mark: string
  plate: string
  ink: string
  href?: string
}

export const brands: Brand[] = [
  { id: 'yum', name: 'Yum', category: 'Restaurant', mark: 'YUM', plate: '#f3f1ea', ink: '#8d4b32' },
  { id: 'china-kitchen', name: 'China Kitchen', category: 'Chinese Restaurant', mark: 'CHINA\nKITCHEN', plate: '#8eb8d4', ink: '#16324a' },
  { id: 'roots-ivy', name: 'Roots Ivy', category: 'Educational Institute', mark: 'IVY', plate: '#f7f6f3', ink: '#3c2f6b' },
  { id: 'saffer', name: 'Saffer', category: 'Clothing Brand', mark: 'SHAFFER', plate: '#e4d9c4', ink: '#3a3228' },
  { id: 'melting-swan', name: 'Melting Swan', category: 'Continental Restaurant', mark: 'MELTING\nSWAN', plate: '#f4f0e6', ink: '#8a6a2f' },
  { id: 'medspa', name: 'Medspa', category: 'Aesthetic & Skincare Clinic', mark: 'MEDSPA', plate: '#121212', ink: '#f3f1ea' },
  { id: 'the-blush', name: 'The Blush', category: 'Ladies Salon', mark: 'THE BLUSH', plate: '#ead5cb', ink: '#6a3b42' },
  { id: 'coffee-co', name: 'Coffee & Co', category: 'Café', mark: 'COFFEE\n& CO', plate: '#161616', ink: '#d6b25e' },
  { id: 'english-tea-house', name: 'English Tea House', category: 'Café', mark: 'English\nTea House', plate: '#f6f3ee', ink: '#4a3b2a' },
  { id: 'posh', name: 'Posh by Sarwat', category: 'Aesthetic Clinic', mark: 'Posh', plate: '#f6f3f5', ink: '#9a4d73' },
  { id: 'naureen-nawaz', name: 'Naureen Nawaz', category: 'Café & Salon', mark: 'NN', plate: '#c9b48a', ink: '#f7f3ea' },
  { id: 'klap', name: 'Klap', category: 'Fast Food Brand', mark: 'KLAP', plate: '#ef8a1a', ink: '#1a1a1a' },
  { id: 'jetour', name: 'Jetour', category: 'Automotive', mark: 'JETOUR', plate: '#f4f4f4', ink: '#1a1a1a' },
  { id: 'cafe-eleganza', name: 'Cafe Eleganza', category: 'Café', mark: 'Eleganza', plate: '#f7f7f7', ink: '#1a1a1a' },
  { id: 'suzuki', name: 'Suzuki', category: 'Automotive', mark: 'SUZUKI', plate: '#f3f6fb', ink: '#1d4e89' },
]
