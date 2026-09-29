// /* =========================================================
//    GEO UTILITIES
// ========================================================= */


// /* =========================================================
//    HAVERSINE DISTANCE
// ========================================================= */

// export function distanceInMeters(
//   lat1,
//   lon1,
//   lat2,
//   lon2
// ) {
//   const earthRadius = 6371000;

//   const toRadians = (value) =>
//     (value * Math.PI) / 180;

//   const dLat = toRadians(lat2 - lat1);
//   const dLon = toRadians(lon2 - lon1);

//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRadians(lat1)) *
//       Math.cos(toRadians(lat2)) *
//       Math.sin(dLon / 2) ** 2;

//   const c =
//     2 *
//     Math.atan2(
//       Math.sqrt(a),
//       Math.sqrt(1 - a)
//     );

//   return earthRadius * c;
// }


// /* =========================================================
//    GEOFENCE
// ========================================================= */

// export function isWithinGeofence(
//   currentLatitude,
//   currentLongitude,
//   targetLatitude,
//   targetLongitude,
//   radius = 300
// ) {
//   if (
//     !Number.isFinite(currentLatitude) ||
//     !Number.isFinite(currentLongitude) ||
//     !Number.isFinite(targetLatitude) ||
//     !Number.isFinite(targetLongitude)
//   ) {
//     return {
//       allowed: false,
//       distance: Infinity,
//       radius,
//     };
//   }

//   const distance = distanceInMeters(
//     currentLatitude,
//     currentLongitude,
//     targetLatitude,
//     targetLongitude
//   );

//   return {
//     allowed: distance <= radius,
//     distance: Math.round(distance),
//     radius,
//   };
// }


// /* =========================================================
//    NOMINATIM REQUEST
// ========================================================= */

// async function searchNominatim(
//   query,
//   limit = 1
// ) {
//   const url = new URL(
//     "https://nominatim.openstreetmap.org/search"
//   );

//   url.searchParams.set(
//     "q",
//     query
//   );

//   url.searchParams.set(
//     "format",
//     "json"
//   );

//   url.searchParams.set(
//     "limit",
//     String(limit)
//   );

//   url.searchParams.set(
//     "countrycodes",
//     "in"
//   );

//   url.searchParams.set(
//     "addressdetails",
//     "1"
//   );

//   const response = await fetch(
//     url,
//     {
//       method: "GET",

//       headers: {
//         "User-Agent":
//           "FieldOps-Recovery-Operations/1.0",
//         Accept:
//           "application/json",
//         "Accept-Language":
//           "en",
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(
//       "Address location service is unavailable."
//     );
//   }

//   const results =
//     await response.json();

//   return Array.isArray(results)
//     ? results
//     : [];
// }


// /* =========================================================
//    VALID COORDINATES
// ========================================================= */

// function validCoordinates(
//   latitude,
//   longitude
// ) {
//   return (
//     Number.isFinite(latitude) &&
//     Number.isFinite(longitude) &&
//     latitude >= -90 &&
//     latitude <= 90 &&
//     longitude >= -180 &&
//     longitude <= 180
//   );
// }


// /* =========================================================
//    PLUS CODE DETECTION
// ========================================================= */

// function extractPlusCode(
//   address
// ) {
//   const match =
//     address
//       .toUpperCase()
//       .match(
//         /\b([23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX0-9]{2,7})\b/
//       );

//   return match
//     ? match[1]
//     : null;
// }


// /* =========================================================
//    CLEAN PLUS CODE FROM ADDRESS
// ========================================================= */

// function removePlusCode(
//   address,
//   plusCode
// ) {
//   if (!plusCode) {
//     return address.trim();
//   }

//   return address
//     .replace(
//       new RegExp(
//         plusCode.replace(
//           "+",
//           "\\+"
//         ),
//         "ig"
//       ),
//       ""
//     )
//     .replace(
//       /,\s*,/g,
//       ","
//     )
//     .replace(
//       /^\s*,\s*/,
//       ""
//     )
//     .replace(
//       /\s*,\s*$/,
//       ""
//     )
//     .trim();
// }


// /* =========================================================
//    BASIC OPEN LOCATION CODE DECODER
     
//    This handles FULL Plus Codes.
// ========================================================= */

// const OLC_ALPHABET =
//   "23456789CFGHJMPQRVWX";

// const OLC_PAIR_RESOLUTIONS = [
//   20,
//   1,
//   0.05,
//   0.0025,
//   0.000125,
// ];

// function isValidOlcCharacter(
//   character
// ) {
//   return (
//     OLC_ALPHABET.includes(
//       character
//     )
//   );
// }


// function decodeFullPlusCode(
//   code
// ) {
//   const normalized =
//     code
//       .toUpperCase()
//       .replace(
//         /\s/g,
//         ""
//       );

//   const separatorIndex =
//     normalized.indexOf("+");

//   if (
//     separatorIndex === -1
//   ) {
//     return null;
//   }

//   /*
//    * A full OLC has the separator
//    * after eight characters.
//    */
//   if (
//     separatorIndex !== 8
//   ) {
//     return null;
//   }

//   const cleanCode =
//     normalized.replace(
//       "+",
//       ""
//     );

//   const pairPart =
//     cleanCode.substring(
//       0,
//       10
//     );

//   if (
//     pairPart.length < 10
//   ) {
//     return null;
//   }

//   let latitude = -90;
//   let longitude = -180;

//   for (
//     let index = 0;
//     index < 10;
//     index += 2
//   ) {
//     const latChar =
//       pairPart[index];

//     const lngChar =
//       pairPart[index + 1];

//     if (
//       !isValidOlcCharacter(
//         latChar
//       ) ||
//       !isValidOlcCharacter(
//         lngChar
//       )
//     ) {
//       return null;
//     }

//     const latValue =
//       OLC_ALPHABET.indexOf(
//         latChar
//       );

//     const lngValue =
//       OLC_ALPHABET.indexOf(
//         lngChar
//       );

//     const resolution =
//       OLC_PAIR_RESOLUTIONS[
//         index / 2
//       ];

//     latitude +=
//       latValue * resolution;

//     longitude +=
//       lngValue * resolution;
//   }

//   const resolution =
//     OLC_PAIR_RESOLUTIONS[4];

//   return {
//     latitude:
//       latitude +
//       resolution / 2,

//     longitude:
//       longitude +
//       resolution / 2,
//   };
// }


// /* =========================================================
//    RECOVER SHORT PLUS CODE
     
//    Example:
//    5J58+MJ
     
//    We first geocode the locality:
//    Hunasamaranahalli, Karnataka
     
//    Then recover the missing Plus Code
//    prefix relative to that locality.
// ========================================================= */

// async function recoverShortPlusCode(
//   shortCode,
//   referenceLatitude,
//   referenceLongitude
// ) {
//   const normalized =
//     shortCode
//       .toUpperCase()
//       .replace(
//         /\s/g,
//         ""
//       );

//   const separatorIndex =
//     normalized.indexOf("+");

//   if (
//     separatorIndex === -1
//   ) {
//     return null;
//   }

//   if (
//     separatorIndex >= 8
//   ) {
//     return decodeFullPlusCode(
//       normalized
//     );
//   }

//   const digitsToRecover =
//     8 - separatorIndex;

//   /*
//    * Generate a reference full
//    * Plus Code around the locality.
//    */
//   const referenceCode =
//     encodePlusCode(
//       referenceLatitude,
//       referenceLongitude
//     );

//   const prefix =
//     referenceCode.substring(
//       0,
//       digitsToRecover
//     );

//   let recovered =
//     `${prefix}${normalized}`;

//   /*
//    * Decode the recovered code.
//    */
//   let decoded =
//     decodeFullPlusCode(
//       recovered
//     );

//   if (!decoded) {
//     return null;
//   }

//   /*
//    * Short codes can cross one
//    * resolution boundary. Test nearby
//    * candidates and select the one
//    * closest to the locality reference.
//    */
//   const resolution =
//     Math.pow(
//       20,
//       2 -
//         digitsToRecover / 2
//     );

//   const candidates = [
//     decoded,
//     {
//       latitude:
//         decoded.latitude +
//         resolution,

//       longitude:
//         decoded.longitude,
//     },
//     {
//       latitude:
//         decoded.latitude -
//         resolution,

//       longitude:
//         decoded.longitude,
//     },
//     {
//       latitude:
//         decoded.latitude,

//       longitude:
//         decoded.longitude +
//         resolution,
//     },
//     {
//       latitude:
//         decoded.latitude,

//       longitude:
//         decoded.longitude -
//         resolution,
//     },
//   ];

//   const validCandidates =
//     candidates.filter(
//       (candidate) =>
//         validCoordinates(
//           candidate.latitude,
//           candidate.longitude
//         )
//     );

//   validCandidates.sort(
//     (a, b) =>
//       distanceInMeters(
//         referenceLatitude,
//         referenceLongitude,
//         a.latitude,
//         a.longitude
//       ) -
//       distanceInMeters(
//         referenceLatitude,
//         referenceLongitude,
//         b.latitude,
//         b.longitude
//       )
//   );

//   return (
//     validCandidates[0] ||
//     null
//   );
// }


// /* =========================================================
//    OPEN LOCATION CODE ENCODER
     
//    Used only to create the reference
//    full code for short-code recovery.
// ========================================================= */

// function encodePlusCode(
//   latitude,
//   longitude
// ) {
//   let lat =
//     Math.max(
//       -90,
//       Math.min(
//         90,
//         latitude
//       )
//     );

//   let lng =
//     longitude;

//   while (lng < -180) {
//     lng += 360;
//   }

//   while (lng >= 180) {
//     lng -= 360;
//   }

//   /*
//    * 90 degrees is handled specially
//    * by OLC.
//    */
//   if (lat === 90) {
//     lat -= 0.000000001;
//   }

//   lat += 90;
//   lng += 180;

//   let code = "";

//   for (
//     let i = 0;
//     i < 5;
//     i++
//   ) {
//     const resolution =
//       OLC_PAIR_RESOLUTIONS[i];

//     const latDigit =
//       Math.floor(
//         lat / resolution
//       );

//     const lngDigit =
//       Math.floor(
//         lng / resolution
//       );

//     code +=
//       OLC_ALPHABET[
//         Math.min(
//           19,
//           latDigit
//         )
//       ];

//     code +=
//       OLC_ALPHABET[
//         Math.min(
//           19,
//           lngDigit
//         )
//       ];

//     lat -=
//       latDigit *
//       resolution;

//     lng -=
//       lngDigit *
//       resolution;
//   }

//   return (
//     code.substring(0, 8) +
//     "+" +
//     code.substring(8)
//   );
// }


// /* =========================================================
//    ADDRESS → GPS COORDINATES
// ========================================================= */

// export async function geocodeAddress(
//   address
// ) {
//   if (
//     !address ||
//     !address.trim()
//   ) {
//     throw new Error(
//       "Address is required for location lookup."
//     );
//   }

//   const originalAddress =
//     address.trim();

//   const plusCode =
//     extractPlusCode(
//       originalAddress
//     );

//   /*
//    * -------------------------------------------------------
//    * CASE 1:
//    * Full Plus Code
//    * -------------------------------------------------------
//    */
//   if (
//     plusCode &&
//     plusCode.indexOf("+") === 8
//   ) {
//     const decoded =
//       decodeFullPlusCode(
//         plusCode
//       );

//     if (
//       decoded &&
//       validCoordinates(
//         decoded.latitude,
//         decoded.longitude
//       )
//     ) {
//       return {
//         latitude:
//           decoded.latitude,

//         longitude:
//           decoded.longitude,

//         displayName:
//           originalAddress,

//         source:
//           "plus-code",
//       };
//     }
//   }


//   /*
//    * -------------------------------------------------------
//    * CASE 2:
//    * Short Plus Code
//    *
//    * Example:
//    * 5J58+MJ, Hunasamaranahalli,
//    * Karnataka 562157
//    * -------------------------------------------------------
//    */

//   if (plusCode) {
//     const locality =
//       removePlusCode(
//         originalAddress,
//         plusCode
//       );

//     /*
//      * Search the locality without
//      * forcing Bengaluru into it.
//      */
//     const localityQueries = [
//       locality,

//       `${locality}, Karnataka, India`,

//       `${locality}, Bengaluru, Karnataka, India`,
//     ];

//     let reference = null;

//     for (
//       const query of localityQueries
//     ) {
//       if (
//         !query.trim()
//       ) {
//         continue;
//       }

//       try {
//         const results =
//           await searchNominatim(
//             query,
//             1
//           );

//         if (
//           results.length
//         ) {
//           reference =
//             results[0];
//           break;
//         }
//       } catch {
//         /*
//          * Try next query.
//          */
//       }
//     }

//     if (reference) {
//       const referenceLatitude =
//         Number(
//           reference.lat
//         );

//       const referenceLongitude =
//         Number(
//           reference.lon
//         );

//       if (
//         validCoordinates(
//           referenceLatitude,
//           referenceLongitude
//         )
//       ) {
//         const recovered =
//           await recoverShortPlusCode(
//             plusCode,
//             referenceLatitude,
//             referenceLongitude
//           );

//         if (
//           recovered &&
//           validCoordinates(
//             recovered.latitude,
//             recovered.longitude
//           )
//         ) {
//           return {
//             latitude:
//               recovered.latitude,

//             longitude:
//               recovered.longitude,

//             displayName:
//               originalAddress,

//             source:
//               "short-plus-code",
//           };
//         }
//       }
//     }
//   }


//   /*
//    * -------------------------------------------------------
//    * CASE 3:
//    * Normal address
//    *
//    * Do NOT blindly append Bengaluru.
//    * First search exactly what the manager entered.
//    * -------------------------------------------------------
//    */

//   const queries = [
//     originalAddress,

//     `${originalAddress}, India`,

//     `${originalAddress}, Karnataka, India`,
//   ];

//   /*
//    * If the manager gave a Bengaluru-area
//    * address without a city, this is the
//    * final fallback.
//    */
//   if (
//     !/bengaluru|bangalore/i.test(
//       originalAddress
//     )
//   ) {
//     queries.push(
//       `${originalAddress}, Bengaluru, Karnataka, India`
//     );
//   }

//   for (
//     const query of queries
//   ) {
//     try {
//       const results =
//         await searchNominatim(
//           query,
//           1
//         );

//       if (
//         !results.length
//       ) {
//         continue;
//       }

//       const result =
//         results[0];

//       const latitude =
//         Number(
//           result.lat
//         );

//       const longitude =
//         Number(
//           result.lon
//         );

//       if (
//         validCoordinates(
//           latitude,
//           longitude
//         )
//       ) {
//         return {
//           latitude,
//           longitude,

//           displayName:
//             result.display_name ||
//             originalAddress,

//           source:
//             "nominatim",
//         };
//       }
//     } catch {
//       /*
//        * Continue with next query.
//        */
//     }
//   }

//   throw new Error(
//     `Could not locate "${originalAddress}". Please enter a more specific address or Plus Code.`
//   );
// }

/* =========================================================
   GEO UTILITIES
   FieldOps Recovery Operations

   Supports:
   - Normal addresses
   - Google-copied addresses
   - Indian PIN codes
   - Roads / layouts / landmarks
   - Villages / towns / cities / districts
   - Full Plus Codes
   - Short Plus Codes
   - Generic fallback geocoding
========================================================= */


/* =========================================================
   HAVERSINE DISTANCE
========================================================= */

export function distanceInMeters(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const earthRadius = 6371000;

  const toRadians = (value) =>
    (value * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}


/* =========================================================
   GEOFENCE
========================================================= */

export function isWithinGeofence(
  currentLatitude,
  currentLongitude,
  targetLatitude,
  targetLongitude,
  radius = 300
) {
  if (
    !Number.isFinite(currentLatitude) ||
    !Number.isFinite(currentLongitude) ||
    !Number.isFinite(targetLatitude) ||
    !Number.isFinite(targetLongitude)
  ) {
    return {
      allowed: false,
      distance: Infinity,
      radius,
    };
  }

  const distance = distanceInMeters(
    currentLatitude,
    currentLongitude,
    targetLatitude,
    targetLongitude
  );

  return {
    allowed: distance <= radius,
    distance: Math.round(distance),
    radius,
  };
}


/* =========================================================
   VALID COORDINATES
========================================================= */

function validCoordinates(
  latitude,
  longitude
) {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}


/* =========================================================
   NORMALIZE ADDRESS
========================================================= */

function normalizeAddress(address) {
  return String(address || "")
    .replace(/\r?\n/g, ", ")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/,{2,}/g, ",")
    .replace(/,\s*$/g, "")
    .replace(/^\s*,\s*/g, "")
    .trim();
}


/* =========================================================
   EXTRACT PIN CODE
========================================================= */

function extractPinCode(address) {
  const matches = String(address || "").match(
    /\b[1-9][0-9]{5}\b/g
  );

  if (!matches?.length) {
    return null;
  }

  return matches[matches.length - 1];
}


/* =========================================================
   EXTRACT COUNTRY
========================================================= */

function hasIndia(address) {
  return /\bindia\b/i.test(
    String(address || "")
  );
}


/* =========================================================
   ADDRESS NOISE CLEANING
=========================================================

   Google addresses can contain:
   - road
   - rd
   - street
   - st
   - near
   - opposite
   - beside
   - landmark
   - pin
   - postal code

   We do NOT delete these blindly from
   the primary query.

   Instead we create secondary queries
   with lightweight normalization.
========================================================= */

function simplifyAddress(address) {
  return String(address || "")
    .replace(
      /\bpostal\s*code\b/gi,
      ""
    )
    .replace(
      /\bpin\s*code\b/gi,
      ""
    )
    .replace(
      /\bpincode\b/gi,
      ""
    )
    .replace(
      /\s+/g,
      " "
    )
    .replace(
      /,\s*,/g,
      ","
    )
    .replace(
      /^\s*,\s*/,
      ""
    )
    .replace(
      /\s*,\s*$/,
      ""
    )
    .trim();
}


/* =========================================================
   TOKENIZE
========================================================= */

function tokenizeAddress(address) {
  return String(address || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(
      (token) => token.length >= 3
    );
}


/* =========================================================
   NOMINATIM REQUEST
========================================================= */

async function searchNominatim(
  query,
  limit = 5
) {
  const url = new URL(
    "https://nominatim.openstreetmap.org/search"
  );

  url.searchParams.set(
    "q",
    query
  );

  url.searchParams.set(
    "format",
    "jsonv2"
  );

  url.searchParams.set(
    "limit",
    String(limit)
  );

  url.searchParams.set(
    "countrycodes",
    "in"
  );

  url.searchParams.set(
    "addressdetails",
    "1"
  );

  url.searchParams.set(
    "dedupe",
    "1"
  );

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      12000
    );

  try {
    const response =
      await fetch(
        url,
        {
          method: "GET",

          headers: {
            "User-Agent":
              "FieldOps-Recovery-Operations/1.0",
            Accept:
              "application/json",
            "Accept-Language":
              "en",
          },

          signal:
            controller.signal,
        }
      );

    if (!response.ok) {
      throw new Error(
        "Address location service is unavailable."
      );
    }

    const results =
      await response.json();

    return Array.isArray(results)
      ? results
      : [];
  } finally {
    clearTimeout(timeout);
  }
}


/* =========================================================
   PLUS CODE DETECTION
========================================================= */

function extractPlusCode(
  address
) {
  const text =
    String(address || "")
      .toUpperCase();

  /*
   * Open Location Code alphabet:
   * 23456789CFGHJMPQRVWX
   *
   * Examples:
   * 7J4V9P2F+3X
   * 5J58+MJ
   */

  const match =
    text.match(
      /\b([23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX0-9]{2,8})\b/
    );

  return match
    ? match[1]
    : null;
}


/* =========================================================
   REMOVE PLUS CODE
========================================================= */

function removePlusCode(
  address,
  plusCode
) {
  if (!plusCode) {
    return String(address || "").trim();
  }

  return String(address)
    .replace(
      new RegExp(
        plusCode.replace(
          "+",
          "\\+"
        ),
        "ig"
      ),
      ""
    )
    .replace(
      /,\s*,/g,
      ","
    )
    .replace(
      /^\s*,\s*/,
      ""
    )
    .replace(
      /\s*,\s*$/,
      ""
    )
    .trim();
}


/* =========================================================
   OPEN LOCATION CODE CONSTANTS
========================================================= */

const OLC_ALPHABET =
  "23456789CFGHJMPQRVWX";

const OLC_PAIR_RESOLUTIONS = [
  20,
  1,
  0.05,
  0.0025,
  0.000125,
];


/* =========================================================
   OLC CHARACTER VALIDATION
========================================================= */

function isValidOlcCharacter(
  character
) {
  return OLC_ALPHABET.includes(
    character
  );
}


/* =========================================================
   DECODE FULL PLUS CODE
========================================================= */

function decodeFullPlusCode(
  code
) {
  const normalized =
    String(code || "")
      .toUpperCase()
      .replace(/\s/g, "");

  const separatorIndex =
    normalized.indexOf("+");

  if (
    separatorIndex !== 8
  ) {
    return null;
  }

  const cleanCode =
    normalized.replace(
      "+",
      ""
    );

  /*
   * Standard pair-code portion.
   */

  if (
    cleanCode.length < 10
  ) {
    return null;
  }

  const pairPart =
    cleanCode.substring(
      0,
      10
    );

  let latitude = -90;
  let longitude = -180;

  for (
    let index = 0;
    index < 10;
    index += 2
  ) {
    const latChar =
      pairPart[index];

    const lngChar =
      pairPart[index + 1];

    if (
      !isValidOlcCharacter(
        latChar
      ) ||
      !isValidOlcCharacter(
        lngChar
      )
    ) {
      return null;
    }

    const latValue =
      OLC_ALPHABET.indexOf(
        latChar
      );

    const lngValue =
      OLC_ALPHABET.indexOf(
        lngChar
      );

    const resolution =
      OLC_PAIR_RESOLUTIONS[
        index / 2
      ];

    latitude +=
      latValue * resolution;

    longitude +=
      lngValue * resolution;
  }

  /*
   * Return the center of the cell.
   */

  const finalResolution =
    OLC_PAIR_RESOLUTIONS[4];

  return {
    latitude:
      latitude +
      finalResolution / 2,

    longitude:
      longitude +
      finalResolution / 2,
  };
}


/* =========================================================
   ENCODE PLUS CODE
========================================================= */

function encodePlusCode(
  latitude,
  longitude
) {
  let lat =
    Number(latitude);

  let lng =
    Number(longitude);

  if (
    !validCoordinates(
      lat,
      lng
    )
  ) {
    return null;
  }

  /*
   * OLC longitude wraps around.
   */

  while (
    lng < -180
  ) {
    lng += 360;
  }

  while (
    lng >= 180
  ) {
    lng -= 360;
  }

  /*
   * OLC uses a special handling
   * for the north pole.
   */

  if (
    lat === 90
  ) {
    lat -= 0.000000001;
  }

  lat += 90;
  lng += 180;

  let code = "";

  for (
    let index = 0;
    index < 5;
    index++
  ) {
    const resolution =
      OLC_PAIR_RESOLUTIONS[
        index
      ];

    const latDigit =
      Math.floor(
        lat / resolution
      );

    const lngDigit =
      Math.floor(
        lng / resolution
      );

    const safeLatDigit =
      Math.max(
        0,
        Math.min(
          19,
          latDigit
        )
      );

    const safeLngDigit =
      Math.max(
        0,
        Math.min(
          19,
          lngDigit
        )
      );

    code +=
      OLC_ALPHABET[
        safeLatDigit
      ];

    code +=
      OLC_ALPHABET[
        safeLngDigit
      ];

    lat -=
      latDigit *
      resolution;

    lng -=
      lngDigit *
      resolution;
  }

  return (
    code.substring(
      0,
      8
    ) +
    "+" +
    code.substring(
      8
    )
  );
}


/* =========================================================
   RECOVER SHORT PLUS CODE
========================================================= */

function recoverShortPlusCode(
  shortCode,
  referenceLatitude,
  referenceLongitude
) {
  const normalized =
    String(shortCode || "")
      .toUpperCase()
      .replace(/\s/g, "");

  const separatorIndex =
    normalized.indexOf("+");

  if (
    separatorIndex === -1
  ) {
    return null;
  }

  /*
   * Already a full Plus Code.
   */

  if (
    separatorIndex === 8
  ) {
    return decodeFullPlusCode(
      normalized
    );
  }

  /*
   * Short codes contain fewer
   * characters before "+".
   */

  if (
    separatorIndex < 2 ||
    separatorIndex > 7
  ) {
    return null;
  }

  const referenceCode =
    encodePlusCode(
      referenceLatitude,
      referenceLongitude
    );

  if (!referenceCode) {
    return null;
  }

  /*
   * Number of missing characters.
   */

  const missingCharacters =
    8 - separatorIndex;

  const prefix =
    referenceCode.substring(
      0,
      missingCharacters
    );

  const recoveredCode =
    `${prefix}${normalized}`;

  const decoded =
    decodeFullPlusCode(
      recoveredCode
    );

  if (!decoded) {
    return null;
  }

  /*
   * Test neighboring cells.
   *
   * This helps when the reference
   * locality is near an OLC boundary.
   */

  const resolution =
    Math.pow(
      20,
      2 -
        missingCharacters / 2
    );

  const candidates = [
    decoded,

    {
      latitude:
        decoded.latitude +
        resolution,
      longitude:
        decoded.longitude,
    },

    {
      latitude:
        decoded.latitude -
        resolution,
      longitude:
        decoded.longitude,
    },

    {
      latitude:
        decoded.latitude,
      longitude:
        decoded.longitude +
        resolution,
    },

    {
      latitude:
        decoded.latitude,
      longitude:
        decoded.longitude -
        resolution,
    },

    {
      latitude:
        decoded.latitude +
        resolution,
      longitude:
        decoded.longitude +
        resolution,
    },

    {
      latitude:
        decoded.latitude +
        resolution,
      longitude:
        decoded.longitude -
        resolution,
    },

    {
      latitude:
        decoded.latitude -
        resolution,
      longitude:
        decoded.longitude +
        resolution,
    },

    {
      latitude:
        decoded.latitude -
        resolution,
      longitude:
        decoded.longitude -
        resolution,
    },
  ];

  const validCandidates =
    candidates.filter(
      (candidate) =>
        validCoordinates(
          candidate.latitude,
          candidate.longitude
        )
    );

  validCandidates.sort(
    (a, b) =>
      distanceInMeters(
        referenceLatitude,
        referenceLongitude,
        a.latitude,
        a.longitude
      ) -
      distanceInMeters(
        referenceLatitude,
        referenceLongitude,
        b.latitude,
        b.longitude
      )
  );

  return (
    validCandidates[0] ||
    null
  );
}


/* =========================================================
   BUILD GENERIC ADDRESS QUERIES
=========================================================

   IMPORTANT:

   No city or locality is hardcoded.

   We progressively simplify the address
   instead of assuming the location.
========================================================= */

function buildAddressQueries(
  originalAddress
) {
  const normalized =
    normalizeAddress(
      originalAddress
    );

  const simplified =
    simplifyAddress(
      normalized
    );

  const queries = [];

  function add(query) {
    const clean =
      normalizeAddress(
        query
      );

    if (
      !clean
    ) {
      return;
    }

    const exists =
      queries.some(
        (item) =>
          item.toLowerCase() ===
          clean.toLowerCase()
      );

    if (!exists) {
      queries.push(
        clean
      );
    }
  }


  /*
   * Query 1:
   * Exact Google-copied address.
   */

  add(
    normalized
  );


  /*
   * Query 2:
   * Exact address + India.
   */

  if (
    !hasIndia(normalized)
  ) {
    add(
      `${normalized}, India`
    );
  }


  /*
   * Query 3:
   * Simplified address.
   */

  if (
    simplified !== normalized
  ) {
    add(
      simplified
    );
  }


  /*
   * Query 4:
   * Simplified + India.
   */

  if (
    !hasIndia(simplified)
  ) {
    add(
      `${simplified}, India`
    );
  }


  /*
   * Query 5:
   * Address without PIN.
   *
   * Some geocoders perform better
   * when the postcode is removed.
   */

  const pin =
    extractPinCode(
      normalized
    );

  if (
    pin
  ) {
    const withoutPin =
      normalized
        .replace(
          new RegExp(
            `\\b${pin}\\b`,
            "g"
          ),
          ""
        )
        .replace(
          /,\s*,/g,
          ","
        )
        .replace(
          /\s+/g,
          " "
        )
        .trim();

    add(
      withoutPin
    );

    if (
      !hasIndia(withoutPin)
    ) {
      add(
        `${withoutPin}, India`
      );
    }
  }


  /*
   * Query 6:
   * Progressive comma-based
   * simplification.
   *
   * Example:
   *
   * A, B, C, D, E
   *
   * becomes:
   *
   * A, B, C, D
   * A, B, C
   * A, B
   *
   * This allows a very specific
   * Google address to fall back
   * to a known locality.
   */

  const parts =
    normalized
      .split(",")
      .map(
        (part) =>
          part.trim()
      )
      .filter(Boolean);

  if (
    parts.length >= 3
  ) {
    for (
      let count =
        parts.length - 1;
      count >= 2;
      count--
    ) {
      add(
        parts
          .slice(
            0,
            count
          )
          .join(", ")
      );
    }
  }


  /*
   * Query 7:
   * Reverse progressive search from
   * the geographic end of the address.
   *
   * Useful when Google returns:
   *
   * House, Road, Locality, City,
   * District, State, PIN
   */

  if (
    parts.length >= 3
  ) {
    for (
      let start = 1;
      start < parts.length - 1;
      start++
    ) {
      const candidate =
        parts
          .slice(start)
          .join(", ");

      if (
        candidate.length >= 5
      ) {
        add(
          candidate
        );
      }
    }
  }


  /*
   * Query 8:
   * If there is a PIN, explicitly
   * search the PIN together with
   * the final geographic components.
   */

  if (
    pin &&
    parts.length >= 2
  ) {
    const geographicTail =
      parts
        .slice(
          Math.max(
            0,
            parts.length - 4
          )
        )
        .filter(
          (part) =>
            !new RegExp(
              `\\b${pin}\\b`
            ).test(part)
        )
        .join(", ");

    if (
      geographicTail
    ) {
      add(
        `${geographicTail}, ${pin}`
      );
    }
  }


  return queries;
}


/* =========================================================
   RESULT TEXT
========================================================= */

function getResultText(
  result
) {
  const address =
    result?.address || {};

  return [
    result?.display_name,
    result?.name,
    result?.type,
    result?.class,

    address.road,
    address.house_number,
    address.building,

    address.neighbourhood,
    address.suburb,

    address.village,
    address.hamlet,

    address.town,
    address.city,

    address.municipality,
    address.county,

    address.state_district,
    address.district,

    address.state,
    address.postcode,

    address.country,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}


/* =========================================================
   SCORE GEOCODING RESULT
========================================================= */

function scoreGeocodeResult(
  result,
  originalAddress
) {
  const resultText =
    getResultText(
      result
    );

  const inputText =
    String(
      originalAddress || ""
    ).toLowerCase();

  const inputTokens =
    tokenizeAddress(
      originalAddress
    );

  let score = 0;


  /*
   * -------------------------------------------------------
   * PIN CODE
   * -------------------------------------------------------
   */

  const pin =
    extractPinCode(
      originalAddress
    );

  if (
    pin &&
    resultText.includes(
      pin
    )
  ) {
    score += 120;
  }


  /*
   * -------------------------------------------------------
   * TOKEN MATCHING
   * -------------------------------------------------------
   */

  for (
    const token of inputTokens
  ) {
    if (
      resultText.includes(
        token
      )
    ) {
      score +=
        token.length >= 6
          ? 6
          : 3;
    }
  }


  /*
   * -------------------------------------------------------
   * IMPORTANT ADDRESS FIELDS
   * -------------------------------------------------------
   */

  const address =
    result?.address || {};

  const exactFields = [
    address.house_number,
    address.road,
    address.neighbourhood,
    address.suburb,
    address.village,
    address.town,
    address.city,
    address.municipality,
    address.county,
    address.state_district,
    address.district,
    address.state,
    address.postcode,
  ].filter(Boolean);


  for (
    const field of exactFields
  ) {
    const fieldText =
      String(field)
        .toLowerCase()
        .trim();

    if (
      fieldText &&
      inputText.includes(
        fieldText
      )
    ) {
      score += 10;
    }
  }


  /*
   * -------------------------------------------------------
   * RESULT TYPE
   * -------------------------------------------------------
   *
   * We don't force one type because
   * a valid address can be a road,
   * building, village, town, suburb,
   * etc.
   */

  const usefulTypes = [
    "house",
    "building",
    "residential",
    "road",
    "street",
    "place",
    "village",
    "town",
    "city",
    "suburb",
    "neighbourhood",
    "hamlet",
    "municipality",
  ];

  if (
    usefulTypes.includes(
      String(
        result?.type || ""
      ).toLowerCase()
    )
  ) {
    score += 5;
  }


  /*
   * -------------------------------------------------------
   * COUNTRY
   * -------------------------------------------------------
   */

  if (
    /\bindia\b/i.test(
      resultText
    )
  ) {
    score += 5;
  }


  return score;
}


/* =========================================================
   CHOOSE BEST RESULT
========================================================= */

function chooseBestResult(
  results,
  originalAddress
) {
  if (
    !Array.isArray(results) ||
    !results.length
  ) {
    return null;
  }

  const scored =
    results
      .map(
        (result) => ({
          result,

          score:
            scoreGeocodeResult(
              result,
              originalAddress
            ),
        })
      )
      .filter(
        ({ result }) =>
          validCoordinates(
            Number(result?.lat),
            Number(result?.lon)
          )
      )
      .sort(
        (a, b) =>
          b.score - a.score
      );

  return (
    scored[0]?.result ||
    null
  );
}


/* =========================================================
   COLLECT ADDRESS RESULTS
========================================================= */

async function searchAddressCandidates(
  queries
) {
  const allResults = [];

  for (
    const query of queries
  ) {
    try {
      const results =
        await searchNominatim(
          query,
          5
        );

      for (
        const result of results
      ) {
        const latitude =
          Number(
            result?.lat
          );

        const longitude =
          Number(
            result?.lon
          );

        if (
          !validCoordinates(
            latitude,
            longitude
          )
        ) {
          continue;
        }

        const duplicate =
          allResults.some(
            (existing) =>
              Math.abs(
                Number(
                  existing.lat
                ) -
                  latitude
              ) <
                0.000001 &&
              Math.abs(
                Number(
                  existing.lon
                ) -
                  longitude
              ) <
                0.000001
          );

        if (
          !duplicate
        ) {
          allResults.push(
            result
          );
        }
      }
    } catch {
      /*
       * Continue to the next query.
       */
    }
  }

  return allResults;
}


/* =========================================================
   FIND REFERENCE FOR SHORT PLUS CODE
========================================================= */

async function findPlusCodeReference(
  locality
) {
  if (
    !locality ||
    !locality.trim()
  ) {
    return null;
  }

  const queries =
    buildAddressQueries(
      locality
    );

  const results =
    await searchAddressCandidates(
      queries
    );

  const best =
    chooseBestResult(
      results,
      locality
    );

  if (
    !best
  ) {
    return null;
  }

  const latitude =
    Number(
      best.lat
    );

  const longitude =
    Number(
      best.lon
    );

  if (
    !validCoordinates(
      latitude,
      longitude
    )
  ) {
    return null;
  }

  return {
    latitude,
    longitude,

    displayName:
      best.display_name ||
      locality,
  };
}


/* =========================================================
   ADDRESS → GPS
========================================================= */

export async function geocodeAddress(
  address
) {
  if (
    !address ||
    !String(address).trim()
  ) {
    throw new Error(
      "Address is required for location lookup."
    );
  }

  const originalAddress =
    normalizeAddress(
      address
    );


  /* =======================================================
     1. CHECK FOR PLUS CODE
  ======================================================= */

  const plusCode =
    extractPlusCode(
      originalAddress
    );


  /* =======================================================
     2. FULL PLUS CODE
  ======================================================= */

  if (
    plusCode &&
    plusCode.indexOf("+") === 8
  ) {
    const decoded =
      decodeFullPlusCode(
        plusCode
      );

    if (
      decoded &&
      validCoordinates(
        decoded.latitude,
        decoded.longitude
      )
    ) {
      return {
        latitude:
          decoded.latitude,

        longitude:
          decoded.longitude,

        displayName:
          originalAddress,

        source:
          "plus-code",
      };
    }
  }


  /* =======================================================
     3. SHORT PLUS CODE
  ======================================================= */

  if (
    plusCode &&
    plusCode.indexOf("+") !== 8
  ) {
    const locality =
      removePlusCode(
        originalAddress,
        plusCode
      );

    const reference =
      await findPlusCodeReference(
        locality
      );

    if (
      reference
    ) {
      const recovered =
        recoverShortPlusCode(
          plusCode,
          reference.latitude,
          reference.longitude
        );

      if (
        recovered &&
        validCoordinates(
          recovered.latitude,
          recovered.longitude
        )
      ) {
        return {
          latitude:
            recovered.latitude,

          longitude:
            recovered.longitude,

          displayName:
            originalAddress,

          source:
            "short-plus-code",
        };
      }
    }
  }


  /* =======================================================
     4. NORMAL GOOGLE-STYLE ADDRESS
  ======================================================= */

  const queries =
    buildAddressQueries(
      originalAddress
    );


  const results =
    await searchAddressCandidates(
      queries
    );


  const bestResult =
    chooseBestResult(
      results,
      originalAddress
    );


  /* =======================================================
     5. SUCCESS
  ======================================================= */

  if (
    bestResult
  ) {
    const latitude =
      Number(
        bestResult.lat
      );

    const longitude =
      Number(
        bestResult.lon
      );

    if (
      validCoordinates(
        latitude,
        longitude
      )
    ) {
      return {
        latitude,
        longitude,

        displayName:
          bestResult.display_name ||
          originalAddress,

        source:
          "nominatim",
      };
    }
  }


  /* =======================================================
     6. FINAL GENERIC POSTCODE FALLBACK
  ======================================================= */

  const pin =
    extractPinCode(
      originalAddress
    );

  if (
    pin
  ) {
    try {
      const postcodeResults =
        await searchNominatim(
          pin,
          10
        );

      const bestPostcodeResult =
        chooseBestResult(
          postcodeResults,
          originalAddress
        );

      if (
        bestPostcodeResult
      ) {
        const latitude =
          Number(
            bestPostcodeResult.lat
          );

        const longitude =
          Number(
            bestPostcodeResult.lon
          );

        if (
          validCoordinates(
            latitude,
            longitude
          )
        ) {
          return {
            latitude,
            longitude,

            displayName:
              bestPostcodeResult.display_name ||
              `Postcode ${pin}`,

            source:
              "postcode-fallback",
          };
        }
      }
    } catch {
      /*
       * Continue to final error.
       */
    }
  }


  /* =======================================================
     7. FAILED
  ======================================================= */

  throw new Error(
    `Could not locate "${originalAddress}". Please check the address or paste the Google Maps address/Plus Code again.`
  );
}