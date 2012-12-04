var rooms = {
  '00': {
    name: 'The Crew',
    originHeading: -30,
    links: [
    { heading: -150,
      pitch: -15,
      description: 'Get Started!',
      pano: '01'
    }]
  },
  '01': {
    name: 'Helipad Lookout',
    originHeading: -260,
    links: [
    { heading: 190,
      description: 'Back Down',
      pano: '00'
    },
    { heading: 280,
      description: 'Next Lookout',
      pano: '02'
    }]
  },
  '02': {
    name: 'Lookout #2',
    originHeading: 70,
    links: [
    { heading: -20,
      description: 'Back Down',
      pano: '01'
    },
    { heading: 270,
      description: 'To The Summit!',
      pano: '03'
    }]
  },
   '03': {
     name: 'Chiefs On The Chief!',
     heading: 90,
     links: [
    { heading: 150,
      description: 'Back Down',
      pano: '02'
    },
    { heading: 220,
      description: 'Secret Spot',
      pano: '04'
    },
    { heading: 290,
      description: 'Summit Lookout',
      pano: '05'
    }]
  },
   '04': {
    name: 'Secret Spot',
    originHeading: -50,
    links: [
    { heading: -30,
      description: 'Back',
      pano: '03'
    }]
  },
    '05': {
    name: 'Summit Lookout',
    originHeading: 130,
    links: [
    { heading: -30,
      description: 'Back',
      pano: '03'
    }]
  }
}

