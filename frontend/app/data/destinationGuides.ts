export type DestinationGuide = {
  byAir: string;
  byRail: string;
  byRoad: string;
  localTransit: string;
};

export const destinationGuides: Record<string, DestinationGuide> = {
  'jim-corbett': {
    byAir: 'Fly to Pantnagar Airport, then drive about 2.5 to 3 hours to the Corbett gates.',
    byRail: 'Ramnagar railway station is the closest and easiest rail arrival point for most lodges.',
    byRoad: 'Corbett is commonly reached by road from Delhi in about 6 to 7 hours depending on traffic.',
    localTransit: 'Use lodge transfers, private cabs, and pre-booked safari jeeps for local movement.',
  },
  kaziranga: {
    byAir: 'Fly into Jorhat or Guwahati, then continue by road to Kaziranga.',
    byRail: 'Furkating is a practical railhead, though many travelers still prefer the Guwahati arrival route.',
    byRoad: 'Kaziranga is usually reached by road from Guwahati in roughly 4.5 to 5.5 hours.',
    localTransit: 'Safari zones are best managed through hotel-arranged jeeps and local drivers.',
  },
  ranthambore: {
    byAir: 'Jaipur Airport is the usual flight arrival point before the onward road journey to Ranthambore.',
    byRail: 'Sawai Madhopur railway station is the nearest and most convenient rail option.',
    byRoad: 'Ranthambore is often done by road from Jaipur in around 3.5 to 4 hours.',
    localTransit: 'Use safari canters, jeeps, and hotel transfers for zone access.',
  },
  bandhavgarh: {
    byAir: 'Fly into Jabalpur or Khajuraho, then continue by road to the park area.',
    byRail: 'Umaria railway station is the nearest practical railhead.',
    byRoad: 'Bandhavgarh is usually packaged with road transfers from Jabalpur, Umaria, or Kanha.',
    localTransit: 'Safari jeeps and lodge-arranged vehicles are the standard way to move around.',
  },
  kanha: {
    byAir: 'The most common air entry is Jabalpur or Raipur depending on your wider route.',
    byRail: 'Gondia and Jabalpur can both work as rail-linked arrival points for Kanha transfers.',
    byRoad: 'Kanha is reached by road through central India forest circuits, often from Jabalpur, Nagpur, or Pench.',
    localTransit: 'Game drives and lodge vehicles handle most practical local transport.',
  },
  sundarbans: {
    byAir: 'Fly to Kolkata, then continue by road and boat through the embarkation point.',
    byRail: 'Sealdah-linked regional rail plus road transfers can be used, though most guests prefer private transfer.',
    byRoad: 'The road portion usually runs from Kolkata to the jetty before the boat transfer starts.',
    localTransit: 'Boat transport is central to the Sundarbans experience, with very limited conventional road movement.',
  },
  periyar: {
    byAir: 'Cochin or Madurai airports are the usual gateways depending on the rest of the itinerary.',
    byRail: 'Kottayam is a useful rail entry point before the hill transfer to Thekkady/Periyar.',
    byRoad: 'Periyar is usually reached by private car from Kochi, Munnar, Alleppey, or Madurai.',
    localTransit: 'Local sightseeing is best done with private cabs, hotel transfers, and guided activity vehicles.',
  },
  goa: {
    byAir: 'Use Goa International Airport or Manohar International Airport depending on the beach belt you prefer.',
    byRail: 'Madgaon and Thivim are the most practical rail stations for different parts of Goa.',
    byRoad: 'Goa is easy to reach by road from nearby Maharashtra and Karnataka hubs.',
    localTransit: 'Rental cars, cabs, and two-wheelers are the most flexible ways to move between beaches.',
  },
  gokarna: {
    byAir: 'Goa or Hubballi are the most common air gateways before the onward drive to Gokarna.',
    byRail: 'Gokarna Road station is available, though many travelers prefer nearby larger stations with better connectivity.',
    byRoad: 'Road access from Goa and coastal Karnataka is one of the easiest ways to reach Gokarna.',
    localTransit: 'Auto-rickshaws, local cabs, and short walks between beaches are the standard mode.',
  },
  varkala: {
    byAir: 'Trivandrum is the closest airport and works well for Varkala arrivals.',
    byRail: 'Varkala Sivagiri station is the easiest rail option.',
    byRoad: 'Varkala is simple to reach by road from Trivandrum and nearby Kerala circuits.',
    localTransit: 'Auto-rickshaws and local cabs are enough for most clifftop and beach movements.',
  },
  kovalam: {
    byAir: 'Trivandrum airport is the nearest and most convenient air gateway.',
    byRail: 'Trivandrum Central is the strongest railway arrival point before a short road transfer.',
    byRoad: 'Kovalam is an easy drive from Trivandrum and nearby Kerala destinations.',
    localTransit: 'Autos, cabs, and hotel transfers cover almost all practical local needs.',
  },
  puri: {
    byAir: 'Bhubaneswar is the usual airport for Puri-bound travelers.',
    byRail: 'Puri railway station is directly useful and well connected.',
    byRoad: 'Puri can be comfortably reached from Bhubaneswar by road in a short transfer.',
    localTransit: 'Autos, local cabs, and guided day vehicles are the most common transport options.',
  },
  tarkarli: {
    byAir: 'Goa airports are often the easiest air entry before the coastal drive south.',
    byRail: 'Kudal is a common railhead for Tarkarli transfers.',
    byRoad: 'Tarkarli is popular for self-drive and chauffeur-driven road trips across the Konkan coast.',
    localTransit: 'Private vehicles and locally arranged cabs are the most dependable way to move around.',
  },
  'swaraj-dweep': {
    byAir: 'Fly into Port Blair first, then continue onward by scheduled ferry to Swaraj Dweep.',
    byRail: 'There is no rail option; the island journey is air plus ferry based.',
    byRoad: 'Road travel is limited to local island roads after your ferry arrival.',
    localTransit: 'Use local cabs, scooters, and resort transfers once on the island.',
  },
  manali: {
    byAir: 'Bhuntar airport is the nearest air option, though many travelers still choose Chandigarh or Delhi plus road.',
    byRail: 'There is no direct rail station in Manali, so train travel usually ends at Chandigarh or Kalka before road transfer.',
    byRoad: 'Manali is frequently reached by overnight Volvo, self-drive, or chauffeur-driven road trips.',
    localTransit: 'Cabs are best for Solang, Atal Tunnel, and nearby sightseeing circuits.',
  },
  shimla: {
    byAir: 'Chandigarh is the most practical flight gateway for most travelers heading to Shimla.',
    byRail: 'Kalka is the main railhead, followed by the classic toy train route to Shimla.',
    byRoad: 'Road travel from Chandigarh is straightforward and widely used.',
    localTransit: 'Walking, local taxis, and short hired transfers cover most sightseeing well.',
  },
  darjeeling: {
    byAir: 'Bagdogra is the closest major airport for Darjeeling arrivals.',
    byRail: 'New Jalpaiguri is the strongest rail gateway, often paired with a road or toy train segment.',
    byRoad: 'Darjeeling is usually reached by hill road from Bagdogra or NJP.',
    localTransit: 'Local cabs and walking are the main ways to move around town and viewpoints.',
  },
  nainital: {
    byAir: 'Pantnagar airport is the nearest air gateway for Nainital.',
    byRail: 'Kathgodam is the main rail station used for Nainital transfers.',
    byRoad: 'Nainital is commonly reached by road from Delhi or from Kathgodam after train arrival.',
    localTransit: 'Walking, local taxis, and short private transfers work best around the lake and hills.',
  },
  mussoorie: {
    byAir: 'Dehradun airport is the closest and easiest air gateway.',
    byRail: 'Dehradun railway station is the usual rail entry before the uphill road transfer.',
    byRoad: 'Mussoorie is an easy drive from Dehradun and a manageable road trip from Delhi.',
    localTransit: 'Walking plus local taxis works well for Mall Road and nearby viewpoints.',
  },
  gangtok: {
    byAir: 'Pakyong or Bagdogra can both serve as air arrival options depending on availability.',
    byRail: 'New Jalpaiguri is the most common rail arrival point before the mountain drive to Gangtok.',
    byRoad: 'Gangtok is generally reached by road from Bagdogra or NJP.',
    localTransit: 'Local cabs are essential for viewpoints, monasteries, and surrounding excursion points.',
  },
  munnar: {
    byAir: 'Cochin airport is the standard air gateway for Munnar.',
    byRail: 'There is no direct rail station in Munnar, so rail travelers usually arrive at Aluva or Ernakulam and continue by road.',
    byRoad: 'Munnar is normally reached by scenic road transfer from Kochi, Thekkady, or Alleppey.',
    localTransit: 'Private cabs are the most practical way to handle tea-estate viewpoints and day touring.',
  },
  usa: {
    byAir: 'Fly into the nearest major international gateway such as New York, Los Angeles, San Francisco, or Las Vegas depending on your route.',
    byRail: 'Rail options exist in select corridors, but most long-distance movement is better planned with flights or road sectors.',
    byRoad: 'Road trips work especially well for national parks, coastal highways, and multi-state circuits.',
    localTransit: 'Major cities offer public transport, while many scenic regions are better with rental cars or private transfers.',
  },
  australia: {
    byAir: 'Sydney, Melbourne, Brisbane, and Cairns are the usual international arrival gateways.',
    byRail: 'Rail is useful in a few sectors, but domestic flights handle most long-distance movement.',
    byRoad: 'Road routes are excellent for coastal drives, wine regions, and self-drive state circuits.',
    localTransit: 'City trains, trams, ferries, and rental cars combine well depending on the destination.',
  },
  europe: {
    byAir: 'Most itineraries begin in major hubs such as Paris, Rome, Zurich, Amsterdam, or Frankfurt.',
    byRail: 'Europe is highly rail-friendly, especially for city-to-city and alpine sectors.',
    byRoad: 'Private transfers and self-drive trips work well in countryside, lake, and mountain regions.',
    localTransit: 'Public transport is usually strong across cities, with taxis and local trains filling the gaps.',
  },
};
