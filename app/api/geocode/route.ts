import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = 'AIzaSyChXG4uzQaS5lYmEH9nWmRI3_YRLwaqV0I';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json({ error: 'Failed to geocode address' }, { status: 500 });
  }
}
