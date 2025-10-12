import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get('zipCode');

  console.log('🔍 API Route called with ZIP:', zipCode);

  if (!zipCode) {
    return NextResponse.json({ error: 'ZIP code is required' }, { status: 400 });
  }

  try {
    // Step 1: Get state and location info from ZIP code
    const zipResponse = await fetch(
      `https://api.zippopotam.us/us/${zipCode}`
    );

    if (!zipResponse.ok) {
      throw new Error('Invalid ZIP code');
    }

    const zipData = await zipResponse.json();
    const state = zipData.places[0]['state abbreviation'];
    const stateName = zipData.places[0].state;
    const city = zipData.places[0]['place name'];
    const latitude = zipData.places[0].latitude;
    const longitude = zipData.places[0].longitude;

    console.log('📍 Location:', { state, stateName, city, latitude, longitude });

    // Step 2: Get state capital and governor
    const stateCapitals = getStateCapitals();
    const capital = stateCapitals[state] || 'Unknown';
    
    const governors = getCurrentGovernors();
    const governor = governors[state] || null;

    // Step 3: Get senators (always 2 per state)
    const senators = getStateSenators(state);
    console.log('👥 Senators for', state, ':', senators);

    // Step 4: Try to get representative using geocoding
    let representative = null;
    
    // Try Google Civic API if available
    const GOOGLE_CIVIC_API_KEY = process.env.GOOGLE_CIVIC_API_KEY;
    if (GOOGLE_CIVIC_API_KEY) {
      try {
        console.log('📡 Trying Google Civic API for representative...');
        const civicUrl = `https://www.googleapis.com/civicinfo/v2/representatives?address=${zipCode}&key=${GOOGLE_CIVIC_API_KEY}&levels=country&roles=legislatorLowerBody`;
        const civicResponse = await fetch(civicUrl);
        
        if (civicResponse.ok) {
          const civicData = await civicResponse.json();
          console.log('✅ Google Civic API response received');
          
          // Extract representative
          const offices = civicData.offices || [];
          const officials = civicData.officials || [];
          
          for (const office of offices) {
            if (office.name.toLowerCase().includes('representative')) {
              const index = office.officialIndices?.[0];
              if (index !== undefined && officials[index]) {
                representative = officials[index].name;
                console.log('✅ Found representative:', representative);
                break;
              }
            }
          }
        }
      } catch (error) {
        console.log('⚠️ Google Civic API failed:', error.message);
      }
    }

    // Step 5: Return combined data
    return NextResponse.json({
      state: state,
      stateName: stateName,
      city: city,
      capital: capital,
      governor: governor,
      senators: senators,
      representative: representative || `Visit house.gov to find your representative for ${city}, ${state}`,
      location: { latitude, longitude },
      message: !representative ? 'Representative lookup requires full address. Use house.gov link for accurate info.' : null
    });

  } catch (error) {
    console.error('💥 Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch representative information' },
      { status: 500 }
    );
  }
}

function getStateCapitals() {
  return {
    'AL': 'Montgomery', 'AK': 'Juneau', 'AZ': 'Phoenix', 'AR': 'Little Rock',
    'CA': 'Sacramento', 'CO': 'Denver', 'CT': 'Hartford', 'DE': 'Dover',
    'FL': 'Tallahassee', 'GA': 'Atlanta', 'HI': 'Honolulu', 'ID': 'Boise',
    'IL': 'Springfield', 'IN': 'Indianapolis', 'IA': 'Des Moines', 'KS': 'Topeka',
    'KY': 'Frankfort', 'LA': 'Baton Rouge', 'ME': 'Augusta', 'MD': 'Annapolis',
    'MA': 'Boston', 'MI': 'Lansing', 'MN': 'Saint Paul', 'MS': 'Jackson',
    'MO': 'Jefferson City', 'MT': 'Helena', 'NE': 'Lincoln', 'NV': 'Carson City',
    'NH': 'Concord', 'NJ': 'Trenton', 'NM': 'Santa Fe', 'NY': 'Albany',
    'NC': 'Raleigh', 'ND': 'Bismarck', 'OH': 'Columbus', 'OK': 'Oklahoma City',
    'OR': 'Salem', 'PA': 'Harrisburg', 'RI': 'Providence', 'SC': 'Columbia',
    'SD': 'Pierre', 'TN': 'Nashville', 'TX': 'Austin', 'UT': 'Salt Lake City',
    'VT': 'Montpelier', 'VA': 'Richmond', 'WA': 'Olympia', 'WV': 'Charleston',
    'WI': 'Madison', 'WY': 'Cheyenne', 'DC': 'Washington, D.C.'
  };
}

function getCurrentGovernors() {
  return {
    'AL': 'Kay Ivey', 'AK': 'Mike Dunleavy', 'AZ': 'Katie Hobbs', 'AR': 'Sarah Huckabee Sanders',
    'CA': 'Gavin Newsom', 'CO': 'Jared Polis', 'CT': 'Ned Lamont', 'DE': 'John Carney',
    'FL': 'Ron DeSantis', 'GA': 'Brian Kemp', 'HI': 'Josh Green', 'ID': 'Brad Little',
    'IL': 'J.B. Pritzker', 'IN': 'Mike Braun', 'IA': 'Kim Reynolds', 'KS': 'Laura Kelly',
    'KY': 'Andy Beshear', 'LA': 'Jeff Landry', 'ME': 'Janet Mills', 'MD': 'Wes Moore',
    'MA': 'Maura Healey', 'MI': 'Gretchen Whitmer', 'MN': 'Tim Walz', 'MS': 'Tate Reeves',
    'MO': 'Mike Kehoe', 'MT': 'Greg Gianforte', 'NE': 'Jim Pillen', 'NV': 'Joe Lombardo',
    'NH': 'Kelly Ayotte', 'NJ': 'Phil Murphy', 'NM': 'Michelle Lujan Grisham', 'NY': 'Kathy Hochul',
    'NC': 'Josh Stein', 'ND': 'Kelly Armstrong', 'OH': 'Mike DeWine', 'OK': 'Kevin Stitt',
    'OR': 'Tina Kotek', 'PA': 'Josh Shapiro', 'RI': 'Dan McKee', 'SC': 'Henry McMaster',
    'SD': 'Kristi Noem', 'TN': 'Bill Lee', 'TX': 'Greg Abbott', 'UT': 'Spencer Cox',
    'VT': 'Phil Scott', 'VA': 'Glenn Youngkin', 'WA': 'Bob Ferguson', 'WV': 'Patrick Morrisey',
    'WI': 'Tony Evers', 'WY': 'Mark Gordon', 'DC': 'Muriel Bowser (Mayor)'
  };
}

function getStateSenators(state) {
  // Current U.S. Senators as of 2025
  const senators = {
    'AL': ['Katie Britt', 'Tommy Tuberville'],
    'AK': ['Lisa Murkowski', 'Dan Sullivan'],
    'AZ': ['Mark Kelly', 'Ruben Gallego'],
    'AR': ['John Boozman', 'Tom Cotton'],
    'CA': ['Alex Padilla', 'Adam Schiff'],
    'CO': ['Michael Bennet', 'John Hickenlooper'],
    'CT': ['Richard Blumenthal', 'Chris Murphy'],
    'DE': ['Tom Carper', 'Chris Coons'],
    'FL': ['Marco Rubio', 'Rick Scott'],
    'GA': ['Jon Ossoff', 'Raphael Warnock'],
    'HI': ['Brian Schatz', 'Mazie Hirono'],
    'ID': ['Mike Crapo', 'Jim Risch'],
    'IL': ['Dick Durbin', 'Tammy Duckworth'],
    'IN': ['Todd Young', 'Jim Banks'],
    'IA': ['Chuck Grassley', 'Joni Ernst'],
    'KS': ['Roger Marshall', 'Jerry Moran'],
    'KY': ['Mitch McConnell', 'Rand Paul'],
    'LA': ['Bill Cassidy', 'John Kennedy'],
    'ME': ['Susan Collins', 'Angus King'],
    'MD': ['Ben Cardin', 'Chris Van Hollen'],
    'MA': ['Elizabeth Warren', 'Ed Markey'],
    'MI': ['Gary Peters', 'Elissa Slotkin'],
    'MN': ['Amy Klobuchar', 'Tina Smith'],
    'MS': ['Roger Wicker', 'Cindy Hyde-Smith'],
    'MO': ['Josh Hawley', 'Eric Schmitt'],
    'MT': ['Jon Tester', 'Steve Daines'],
    'NE': ['Deb Fischer', 'Pete Ricketts'],
    'NV': ['Catherine Cortez Masto', 'Jacky Rosen'],
    'NH': ['Jeanne Shaheen', 'Maggie Hassan'],
    'NJ': ['Cory Booker', 'George Helmy'],
    'NM': ['Martin Heinrich', 'Ben Ray Luján'],
    'NY': ['Chuck Schumer', 'Kirsten Gillibrand'],
    'NC': ['Thom Tillis', 'Ted Budd'],
    'ND': ['John Hoeven', 'Kevin Cramer'],
    'OH': ['Sherrod Brown', 'Bernie Moreno'],
    'OK': ['James Lankford', 'Markwayne Mullin'],
    'OR': ['Ron Wyden', 'Jeff Merkley'],
    'PA': ['Bob Casey', 'John Fetterman'],
    'RI': ['Jack Reed', 'Sheldon Whitehouse'],
    'SC': ['Lindsey Graham', 'Tim Scott'],
    'SD': ['John Thune', 'Mike Rounds'],
    'TN': ['Marsha Blackburn', 'Bill Hagerty'],
    'TX': ['John Cornyn', 'Ted Cruz'],
    'UT': ['Mike Lee', 'Mitt Romney'],
    'VT': ['Bernie Sanders', 'Peter Welch'],
    'VA': ['Mark Warner', 'Tim Kaine'],
    'WA': ['Patty Murray', 'Maria Cantwell'],
    'WV': ['Shelley Moore Capito', 'Joe Manchin'],
    'WI': ['Ron Johnson', 'Tammy Baldwin'],
    'WY': ['John Barrasso', 'Cynthia Lummis'],
    'DC': ['N/A (DC has no voting senators)', 'N/A']
  };

  return senators[state] || ['Check senate.gov for your state', 'Check senate.gov for your state'];
}