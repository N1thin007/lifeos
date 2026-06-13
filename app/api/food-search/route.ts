import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      query
    )}&search_simple=1&action=process&json=1&page_size=15&fields=product_name,nutriments,serving_size,brands`

    const res = await fetch(url, {
      headers: { 'User-Agent': 'LifeOS - Personal Tracker App' },
    })

    if (!res.ok) {
      return NextResponse.json({ results: [] })
    }

    const data = await res.json()

    const results = (data.products || [])
      .filter((p: any) => p.product_name && p.nutriments?.['energy-kcal_100g'])
      .map((p: any) => ({
        name: p.brands ? `${p.product_name} (${p.brands})` : p.product_name,
        calories: Math.round(p.nutriments['energy-kcal_100g'] || 0),
        protein: Math.round((p.nutriments['proteins_100g'] || 0) * 10) / 10,
        carbs: Math.round((p.nutriments['carbohydrates_100g'] || 0) * 10) / 10,
        fat: Math.round((p.nutriments['fat_100g'] || 0) * 10) / 10,
        serving_size: '100g',
      }))
      .slice(0, 10)

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
