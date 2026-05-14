// Maps the first 3 digits of an Indian PIN to one of our 9 service cities.
// Source: official India Post pin-code prefix ranges.
const PREFIX_TO_CITY = {
  // Delhi
  "110": "Delhi",
  // Noida (Gautam Buddha Nagar)
  "201": "Noida",
  // Gurgaon
  "122": "Gurgaon",
  // Ghaziabad
  "201205": "Ghaziabad", // exact pin handled below
  // Faridabad
  "121": "Faridabad",
  // Hyderabad
  "500": "Hyderabad",
  "501": "Hyderabad",
  // Bangalore
  "560": "Bangalore",
  "561": "Bangalore",
  // Chennai
  "600": "Chennai",
  "601": "Chennai",
  "602": "Chennai",
  // Pune
  "411": "Pune",
  "412": "Pune",
  // Mumbai (incl. Thane / Navi Mumbai)
  "400": "Mumbai",
  "401": "Mumbai",
  "402": "Mumbai",
};

// Sub-rules where prefix overlaps two cities (Noida/Ghaziabad both start with 201)
function refine(pin) {
  if (pin.startsWith("201")) {
    // India Post: Ghaziabad 201001-201019, 201101-201206, 201207-201210.
    //            Greater Noida 201301-201318.
    //            Plain Noida (Gautam Buddha Nagar) covers most other 201xxx PINs.
    const n = parseInt(pin, 10);
    const ghaziabadRanges = [
      [201001, 201019], [201101, 201206], [201207, 201210],
    ];
    for (const [lo, hi] of ghaziabadRanges) {
      if (n >= lo && n <= hi) return "Ghaziabad";
    }
    return "Noida";
  }
  return null;
}

export function lookupCityByPin(pin) {
  if (!pin || !/^\d{6}$/.test(pin)) return null;
  const refined = refine(pin);
  if (refined) return refined;
  const prefix3 = pin.slice(0, 3);
  return PREFIX_TO_CITY[prefix3] || null;
}
