import { Gender, HeirInput, HeirResult, InheritanceResult } from './types';

// Helper: greatest common divisor
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { const t = b; b = a % b; a = t; }
  return a;
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

function fractionStr(num: number, den: number): string {
  const g = gcd(num, den);
  return `${num / g}/${den / g}`;
}

export function calculateInheritance(
  totalEstate: number,
  deceasedGender: Gender,
  heirs: HeirInput
): InheritanceResult {
  const results: HeirResult[] = [];
  const blocked: HeirResult[] = [];

  // Determine key flags
  const hasChildren = (heirs?.son ?? 0) > 0 || (heirs?.daughter ?? 0) > 0;
  const hasSons = (heirs?.son ?? 0) > 0;
  const hasGrandchildren = (heirs?.grandsonFromSon ?? 0) > 0 || (heirs?.granddaughterFromSon ?? 0) > 0;
  const hasGrandsons = (heirs?.grandsonFromSon ?? 0) > 0;
  const hasDescendants = hasChildren || hasGrandchildren;
  const hasMaleDescendants = hasSons || hasGrandsons;
  const hasFather = heirs?.father ?? false;
  const hasMother = heirs?.mother ?? false;
  const hasGrandfather = heirs?.grandfather ?? false;
  const fullBrothers = heirs?.fullBrother ?? 0;
  const fullSisters = heirs?.fullSister ?? 0;
  const patHalfBrothers = heirs?.paternalHalfBrother ?? 0;
  const patHalfSisters = heirs?.paternalHalfSister ?? 0;
  const matHalfBrothers = heirs?.maternalHalfBrother ?? 0;
  const matHalfSisters = heirs?.maternalHalfSister ?? 0;
  const totalSiblings = fullBrothers + fullSisters + patHalfBrothers + patHalfSisters + matHalfBrothers + matHalfSisters;
  const hasMultipleSiblings = totalSiblings >= 2;

  // ---- HAJB HIRMAN (complete blocking) ----
  // Grandfather blocked by father
  const grandfatherBlocked = hasFather;
  // Grandmother blocked by mother
  const grandmotherBlocked = hasMother;
  // Grandson/granddaughter from son blocked by son
  const grandsonBlocked = hasSons;
  const granddaughterBlocked = hasSons;
  // Full brother blocked by father/son/grandson
  const fullBrotherBlocked = hasFather || hasMaleDescendants;
  // Full sister blocked by father/son/grandson
  const fullSisterBlocked = hasFather || hasMaleDescendants;
  // Paternal half-brother blocked by father/son/grandson/full brother
  const patHalfBrotherBlocked = hasFather || hasMaleDescendants || fullBrothers > 0;
  // Paternal half-sister blocked by father/son/grandson/full brother/2+ full sisters
  const patHalfSisterBlocked = hasFather || hasMaleDescendants || fullBrothers > 0 || fullSisters >= 2;
  // Maternal half-siblings blocked by father/grandfather/descendants
  const matHalfBlocked = hasFather || (hasGrandfather && !grandfatherBlocked) || hasDescendants;
  // Paternal uncle blocked by father/grandfather/son/grandson/full brother/paternal half-brother
  const paternalUncleBlocked = hasFather || (hasGrandfather && !grandfatherBlocked) || hasMaleDescendants || fullBrothers > 0 || patHalfBrothers > 0;
  // Uncle's son blocked by all above + paternal uncle
  const uncleSonBlocked = paternalUncleBlocked || (heirs?.paternalUncle ?? 0) > 0;

  // Record blocked heirs
  if (hasGrandfather && grandfatherBlocked) {
    blocked.push({ name: 'Kakek (dari ayah)', count: 1, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: 'Terhalang oleh ayah (Hajb Hirman)', role: 'blocked' });
  }
  if (heirs?.grandmother && grandmotherBlocked) {
    blocked.push({ name: 'Nenek', count: 1, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: 'Terhalang oleh ibu (Hajb Hirman)', role: 'blocked' });
  }
  if ((heirs?.grandsonFromSon ?? 0) > 0 && grandsonBlocked) {
    blocked.push({ name: 'Cucu laki-laki dari anak laki-laki', count: heirs?.grandsonFromSon ?? 0, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: 'Terhalang oleh anak laki-laki (Hajb Hirman)', role: 'blocked' });
  }
  if ((heirs?.granddaughterFromSon ?? 0) > 0 && granddaughterBlocked) {
    blocked.push({ name: 'Cucu perempuan dari anak laki-laki', count: heirs?.granddaughterFromSon ?? 0, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: 'Terhalang oleh anak laki-laki (Hajb Hirman)', role: 'blocked' });
  }
  if (fullBrothers > 0 && fullBrotherBlocked) {
    blocked.push({ name: 'Saudara laki-laki kandung', count: fullBrothers, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: hasFather ? 'Terhalang oleh ayah (Hajb Hirman)' : 'Terhalang oleh keturunan laki-laki (Hajb Hirman)', role: 'blocked' });
  }
  if (fullSisters > 0 && fullSisterBlocked) {
    blocked.push({ name: 'Saudara perempuan kandung', count: fullSisters, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: hasFather ? 'Terhalang oleh ayah (Hajb Hirman)' : 'Terhalang oleh keturunan laki-laki (Hajb Hirman)', role: 'blocked' });
  }
  if (patHalfBrothers > 0 && patHalfBrotherBlocked) {
    blocked.push({ name: 'Saudara laki-laki seayah', count: patHalfBrothers, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: fullBrothers > 0 ? 'Terhalang oleh saudara laki-laki kandung (Hajb Hirman)' : 'Terhalang oleh ayah/keturunan laki-laki (Hajb Hirman)', role: 'blocked' });
  }
  if (patHalfSisters > 0 && patHalfSisterBlocked) {
    blocked.push({ name: 'Saudara perempuan seayah', count: patHalfSisters, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: fullSisters >= 2 ? 'Terhalang oleh 2+ saudara perempuan kandung (Hajb Hirman)' : 'Terhalang (Hajb Hirman)', role: 'blocked' });
  }
  if ((matHalfBrothers > 0 || matHalfSisters > 0) && matHalfBlocked) {
    blocked.push({ name: 'Saudara seibu', count: matHalfBrothers + matHalfSisters, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: 'Terhalang oleh ayah/kakek/keturunan (Hajb Hirman)', role: 'blocked' });
  }
  if ((heirs?.paternalUncle ?? 0) > 0 && paternalUncleBlocked) {
    blocked.push({ name: 'Paman (saudara ayah)', count: heirs?.paternalUncle ?? 0, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: 'Terhalang oleh ahli waris yang lebih dekat (Hajb Hirman)', role: 'blocked' });
  }
  if ((heirs?.uncleSon ?? 0) > 0 && uncleSonBlocked) {
    blocked.push({ name: 'Anak paman', count: heirs?.uncleSon ?? 0, basis: '', shareFraction: '-', percentage: 0, amount: 0, blocked: true, blockReason: 'Terhalang oleh ahli waris yang lebih dekat (Hajb Hirman)', role: 'blocked' });
  }

  // ---- DETERMINE SHARES ----
  // We'll work with fractions: numerator/denominator
  interface ShareEntry {
    name: string;
    count: number;
    num: number; // numerator
    den: number; // denominator
    basis: string;
    isAsabah: boolean;
    isMaleAsabah?: boolean;
    asabahPartner?: string;
  }

  const shares: ShareEntry[] = [];
  const asabahList: ShareEntry[] = [];

  // --- SPOUSE ---
  if (deceasedGender === 'female' && heirs?.husband) {
    const num = hasDescendants ? 1 : 1;
    const den = hasDescendants ? 4 : 2;
    shares.push({ name: 'Suami', count: 1, num, den, basis: 'QS. An-Nisa 4:12', isAsabah: false });
  }
  if (deceasedGender === 'male' && (heirs?.wife ?? 0) > 0) {
    const num = 1;
    const den = hasDescendants ? 8 : 4;
    shares.push({ name: 'Istri', count: heirs?.wife ?? 1, num, den, basis: 'QS. An-Nisa 4:12', isAsabah: false });
  }

  // --- Check Umariyyatain special case ---
  // Only spouse + both parents, no children/siblings
  const spouseExists = (deceasedGender === 'female' && heirs?.husband) || (deceasedGender === 'male' && (heirs?.wife ?? 0) > 0);
  const isUmariyyatain = spouseExists && hasFather && hasMother && !hasDescendants && totalSiblings === 0
    && !hasGrandfather && !heirs?.grandmother
    && (heirs?.grandsonFromSon ?? 0) === 0 && (heirs?.granddaughterFromSon ?? 0) === 0;

  // --- FATHER ---
  if (hasFather) {
    if (hasDescendants) {
      shares.push({ name: 'Ayah', count: 1, num: 1, den: 6, basis: 'QS. An-Nisa 4:11', isAsabah: false });
      if (!hasMaleDescendants) {
        // Father gets 1/6 + asabah if only daughters/granddaughters
        asabahList.push({ name: 'Ayah (sisa)', count: 1, num: 0, den: 1, basis: 'QS. An-Nisa 4:11', isAsabah: true });
      }
    } else if (isUmariyyatain) {
      // Umariyyatain: father gets remainder after spouse + mother(1/3 remainder)
      asabahList.push({ name: 'Ayah', count: 1, num: 0, den: 1, basis: 'QS. An-Nisa 4:11 (Al-Umariyyatain)', isAsabah: true });
    } else {
      asabahList.push({ name: 'Ayah', count: 1, num: 0, den: 1, basis: 'QS. An-Nisa 4:11', isAsabah: true });
    }
  }

  // --- MOTHER ---
  if (hasMother) {
    if (isUmariyyatain) {
      // Mother gets 1/3 of remainder after spouse share
      // We'll handle this specially in calculation
      shares.push({ name: 'Ibu', count: 1, num: -1, den: 3, basis: 'QS. An-Nisa 4:11 (Al-Umariyyatain)', isAsabah: false });
    } else if (hasDescendants || hasMultipleSiblings) {
      shares.push({ name: 'Ibu', count: 1, num: 1, den: 6, basis: 'QS. An-Nisa 4:11', isAsabah: false });
    } else {
      shares.push({ name: 'Ibu', count: 1, num: 1, den: 3, basis: 'QS. An-Nisa 4:11', isAsabah: false });
    }
  }

  // --- DAUGHTERS ---
  const daughters = heirs?.daughter ?? 0;
  const sons = heirs?.son ?? 0;
  if (sons > 0 && daughters > 0) {
    // Son and daughter together: asabah bil-ghair (2:1 ratio)
    // handled in asabah section
  } else if (daughters > 0 && sons === 0) {
    if (daughters === 1) {
      shares.push({ name: 'Anak perempuan', count: 1, num: 1, den: 2, basis: 'QS. An-Nisa 4:11', isAsabah: false });
    } else {
      shares.push({ name: 'Anak perempuan', count: daughters, num: 2, den: 3, basis: 'QS. An-Nisa 4:11', isAsabah: false });
    }
  }

  // --- SONS (always asabah) ---
  if (sons > 0) {
    if (daughters > 0) {
      asabahList.push({ name: 'Anak laki-laki & perempuan', count: sons * 2 + daughters, num: 0, den: 1, basis: 'QS. An-Nisa 4:11', isAsabah: true, isMaleAsabah: true });
    } else {
      asabahList.push({ name: 'Anak laki-laki', count: sons, num: 0, den: 1, basis: 'QS. An-Nisa 4:11', isAsabah: true });
    }
  }

  // --- GRANDDAUGHTER FROM SON ---
  if (!granddaughterBlocked && (heirs?.granddaughterFromSon ?? 0) > 0) {
    const gd = heirs?.granddaughterFromSon ?? 0;
    const gs = !grandsonBlocked ? (heirs?.grandsonFromSon ?? 0) : 0;
    if (gs > 0) {
      // Asabah with grandson
      asabahList.push({ name: 'Cucu laki-laki & perempuan dari anak laki-laki', count: gs * 2 + gd, num: 0, den: 1, basis: 'QS. An-Nisa 4:11 (qiyas)', isAsabah: true, isMaleAsabah: true });
    } else {
      if (daughters === 1) {
        // Granddaughter gets 1/6 (completing 2/3)
        shares.push({ name: 'Cucu perempuan dari anak laki-laki', count: gd, num: 1, den: 6, basis: 'Hadits & Ijma\'', isAsabah: false });
      } else if (daughters === 0) {
        if (gd === 1) {
          shares.push({ name: 'Cucu perempuan dari anak laki-laki', count: 1, num: 1, den: 2, basis: 'QS. An-Nisa 4:11 (qiyas)', isAsabah: false });
        } else {
          shares.push({ name: 'Cucu perempuan dari anak laki-laki', count: gd, num: 2, den: 3, basis: 'QS. An-Nisa 4:11 (qiyas)', isAsabah: false });
        }
      }
      // If daughters >= 2, granddaughters get nothing (already covered by hajb for patHalfSister logic but granddaughter blocked by 2+ daughters is not standard - they get 0 as furudh is used up)
    }
  } else if (!grandsonBlocked && (heirs?.grandsonFromSon ?? 0) > 0 && (heirs?.granddaughterFromSon ?? 0) === 0) {
    asabahList.push({ name: 'Cucu laki-laki dari anak laki-laki', count: heirs?.grandsonFromSon ?? 0, num: 0, den: 1, basis: 'QS. An-Nisa 4:11 (qiyas)', isAsabah: true });
  }

  // --- GRANDFATHER (not blocked) ---
  if (hasGrandfather && !grandfatherBlocked) {
    if (hasDescendants) {
      shares.push({ name: 'Kakek (dari ayah)', count: 1, num: 1, den: 6, basis: 'Ijma\' Ulama', isAsabah: false });
    } else {
      asabahList.push({ name: 'Kakek (dari ayah)', count: 1, num: 0, den: 1, basis: 'Ijma\' Ulama', isAsabah: true });
    }
  }

  // --- GRANDMOTHER (not blocked) ---
  if (heirs?.grandmother && !grandmotherBlocked) {
    shares.push({ name: 'Nenek', count: 1, num: 1, den: 6, basis: 'Hadits & Ijma\'', isAsabah: false });
  }

  // --- FULL SISTERS ---
  if (!fullSisterBlocked && fullSisters > 0) {
    if (fullBrothers > 0 && !fullBrotherBlocked) {
      // Handled with full brothers as asabah
    } else {
      if (fullSisters === 1) {
        shares.push({ name: 'Saudara perempuan kandung', count: 1, num: 1, den: 2, basis: 'QS. An-Nisa 4:176', isAsabah: false });
      } else {
        shares.push({ name: 'Saudara perempuan kandung', count: fullSisters, num: 2, den: 3, basis: 'QS. An-Nisa 4:176', isAsabah: false });
      }
    }
  }

  // --- FULL BROTHERS ---
  if (!fullBrotherBlocked && fullBrothers > 0) {
    if (fullSisters > 0 && !fullSisterBlocked) {
      asabahList.push({ name: 'Saudara kandung (lk & pr)', count: fullBrothers * 2 + fullSisters, num: 0, den: 1, basis: 'QS. An-Nisa 4:176', isAsabah: true, isMaleAsabah: true });
    } else {
      asabahList.push({ name: 'Saudara laki-laki kandung', count: fullBrothers, num: 0, den: 1, basis: 'QS. An-Nisa 4:176', isAsabah: true });
    }
  }

  // --- PATERNAL HALF-SISTERS ---
  if (!patHalfSisterBlocked && patHalfSisters > 0) {
    if (patHalfBrothers > 0 && !patHalfBrotherBlocked) {
      // Handled with pat half brothers
    } else {
      if (fullSisters === 1 && !fullSisterBlocked) {
        // Gets 1/6 to complete 2/3
        shares.push({ name: 'Saudara perempuan seayah', count: patHalfSisters, num: 1, den: 6, basis: 'Hadits & Ijma\'', isAsabah: false });
      } else if (fullSisters === 0 || fullSisterBlocked) {
        if (patHalfSisters === 1) {
          shares.push({ name: 'Saudara perempuan seayah', count: 1, num: 1, den: 2, basis: 'QS. An-Nisa 4:176 (qiyas)', isAsabah: false });
        } else {
          shares.push({ name: 'Saudara perempuan seayah', count: patHalfSisters, num: 2, den: 3, basis: 'QS. An-Nisa 4:176 (qiyas)', isAsabah: false });
        }
      }
    }
  }

  // --- PATERNAL HALF-BROTHERS ---
  if (!patHalfBrotherBlocked && patHalfBrothers > 0) {
    if (patHalfSisters > 0 && !patHalfSisterBlocked) {
      asabahList.push({ name: 'Saudara seayah (lk & pr)', count: patHalfBrothers * 2 + patHalfSisters, num: 0, den: 1, basis: 'QS. An-Nisa 4:176 (qiyas)', isAsabah: true, isMaleAsabah: true });
    } else {
      asabahList.push({ name: 'Saudara laki-laki seayah', count: patHalfBrothers, num: 0, den: 1, basis: 'QS. An-Nisa 4:176 (qiyas)', isAsabah: true });
    }
  }

  // --- MATERNAL HALF-SIBLINGS ---
  if (!matHalfBlocked) {
    const totalMat = matHalfBrothers + matHalfSisters;
    if (totalMat > 0) {
      if (totalMat === 1) {
        const name = matHalfBrothers > 0 ? 'Saudara laki-laki seibu' : 'Saudara perempuan seibu';
        shares.push({ name, count: 1, num: 1, den: 6, basis: 'QS. An-Nisa 4:12', isAsabah: false });
      } else {
        shares.push({ name: 'Saudara seibu', count: totalMat, num: 1, den: 3, basis: 'QS. An-Nisa 4:12', isAsabah: false });
      }
    }
  }

  // --- PATERNAL UNCLE ---
  if (!paternalUncleBlocked && (heirs?.paternalUncle ?? 0) > 0) {
    asabahList.push({ name: 'Paman (saudara ayah)', count: heirs?.paternalUncle ?? 0, num: 0, den: 1, basis: 'Hadits & Ijma\'', isAsabah: true });
  }

  // --- UNCLE'S SON ---
  if (!uncleSonBlocked && (heirs?.uncleSon ?? 0) > 0) {
    asabahList.push({ name: 'Anak paman', count: heirs?.uncleSon ?? 0, num: 0, den: 1, basis: 'Hadits & Ijma\'', isAsabah: true });
  }

  // ---- CALCULATE ACTUAL AMOUNTS ----
  
  // Handle Umariyyatain special case
  if (isUmariyyatain) {
    const spouseShare = shares?.find?.((s: ShareEntry) => s?.name === 'Suami' || s?.name === 'Istri');
    const motherEntry = shares?.find?.((s: ShareEntry) => s?.name === 'Ibu');
    if (spouseShare && motherEntry) {
      const spouseAmount = totalEstate * spouseShare.num / spouseShare.den;
      const remainder = totalEstate - spouseAmount;
      const motherAmount = remainder / 3;
      const fatherAmount = remainder - motherAmount;

      results.push({
        name: spouseShare.name,
        count: spouseShare.count,
        basis: spouseShare.basis,
        shareFraction: fractionStr(spouseShare.num, spouseShare.den),
        percentage: (spouseAmount / totalEstate) * 100,
        amount: spouseAmount,
        blocked: false,
        role: 'furudh'
      });
      results.push({
        name: 'Ibu',
        count: 1,
        basis: 'QS. An-Nisa 4:11 (Al-Umariyyatain)',
        shareFraction: '1/3 sisa',
        percentage: (motherAmount / totalEstate) * 100,
        amount: motherAmount,
        blocked: false,
        role: 'furudh'
      });
      results.push({
        name: 'Ayah',
        count: 1,
        basis: 'QS. An-Nisa 4:11 (Al-Umariyyatain)',
        shareFraction: 'Sisa (Ashabah)',
        percentage: (fatherAmount / totalEstate) * 100,
        amount: fatherAmount,
        blocked: false,
        role: 'asabah'
      });

      if (spouseShare.count > 1) {
        const perPerson = results[0].amount / spouseShare.count;
        results[0].name = `${spouseShare.name} (${spouseShare.count} orang, masing-masing Rp ${formatRupiah(perPerson)})`;
      }

      return {
        heirs: results,
        totalEstate,
        aulOccurred: false,
        raddOccurred: false,
        blockedHeirs: blocked
      };
    }
  }

  // Normal calculation
  // Step 1: Find common denominator for all furudh shares
  let commonDen = 1;
  for (const s of shares) {
    if (s.num > 0) {
      commonDen = lcm(commonDen, s.den);
    }
  }

  // Step 2: Convert all shares to common denominator
  let totalFurudhNum = 0;
  const furudhConverted: { entry: ShareEntry; num: number }[] = [];
  for (const s of shares) {
    if (s.num > 0) {
      const converted = s.num * (commonDen / s.den);
      furudhConverted.push({ entry: s, num: converted });
      totalFurudhNum += converted;
    }
  }

  const hasAsabah = asabahList?.length > 0;

  // Step 3: Check for Aul or Radd
  let aulOccurred = false;
  let aulExplanation = '';
  let raddOccurred = false;
  let raddExplanation = '';

  if (totalFurudhNum > commonDen && !hasAsabah) {
    // AUL: proportional reduction
    aulOccurred = true;
    aulExplanation = `Total bagian furudh (${totalFurudhNum}/${commonDen}) melebihi harta. Dilakukan 'Aul (penyesuaian) dengan menaikkan penyebut menjadi ${totalFurudhNum} sehingga semua bagian dikurangi secara proporsional.`;
    // Adjust denominator to totalFurudhNum
    for (const fc of furudhConverted) {
      const amount = totalEstate * fc.num / totalFurudhNum;
      results.push({
        name: fc.entry.name,
        count: fc.entry.count,
        basis: fc.entry.basis,
        shareFraction: fractionStr(fc.num, totalFurudhNum),
        percentage: (amount / totalEstate) * 100,
        amount,
        blocked: false,
        role: 'furudh'
      });
    }
  } else if (totalFurudhNum < commonDen && !hasAsabah) {
    // Check RADD (return surplus to furudh heirs except spouse)
    const spouseEntries = furudhConverted?.filter?.((fc: any) => fc?.entry?.name === 'Suami' || fc?.entry?.name === 'Istri') ?? [];
    const nonSpouse = furudhConverted?.filter?.((fc: any) => fc?.entry?.name !== 'Suami' && fc?.entry?.name !== 'Istri') ?? [];

    if (nonSpouse?.length > 0) {
      raddOccurred = true;
      // Give spouse their fixed share, distribute rest proportionally among non-spouse
      let spouseTotal = 0;
      for (const sp of spouseEntries) {
        const amount = totalEstate * sp.num / commonDen;
        spouseTotal += amount;
        results.push({
          name: sp.entry.name,
          count: sp.entry.count,
          basis: sp.entry.basis,
          shareFraction: fractionStr(sp.num, commonDen),
          percentage: (amount / totalEstate) * 100,
          amount,
          blocked: false,
          role: 'furudh'
        });
      }

      const remainingForRadd = totalEstate - spouseTotal;
      const nonSpouseTotal = nonSpouse?.reduce?.((acc: number, fc: any) => acc + (fc?.num ?? 0), 0) ?? 0;
      raddExplanation = `Setelah pembagian furudh, terdapat sisa harta dan tidak ada ahli waris asabah. Sisa dikembalikan (Radd) secara proporsional kepada ahli waris furudh (kecuali suami/istri).`;

      for (const fc of nonSpouse) {
        const amount = remainingForRadd * fc.num / nonSpouseTotal;
        results.push({
          name: fc.entry.name,
          count: fc.entry.count,
          basis: fc.entry.basis,
          shareFraction: `${fractionStr(fc.num, commonDen)} + Radd`,
          percentage: (amount / totalEstate) * 100,
          amount,
          blocked: false,
          role: 'furudh'
        });
      }
    } else {
      // Only spouse, no radd recipients - give all to spouse (rare)
      for (const fc of furudhConverted) {
        const amount = totalEstate * fc.num / commonDen;
        results.push({
          name: fc.entry.name,
          count: fc.entry.count,
          basis: fc.entry.basis,
          shareFraction: fractionStr(fc.num, commonDen),
          percentage: (amount / totalEstate) * 100,
          amount,
          blocked: false,
          role: 'furudh'
        });
      }
    }
  } else {
    // Normal case: furudh + asabah or exact match
    for (const fc of furudhConverted) {
      const amount = totalEstate * fc.num / commonDen;
      results.push({
        name: fc.entry.name,
        count: fc.entry.count,
        basis: fc.entry.basis,
        shareFraction: fractionStr(fc.num, commonDen),
        percentage: (amount / totalEstate) * 100,
        amount,
        blocked: false,
        role: 'furudh'
      });
    }

    // Distribute remainder to asabah
    if (hasAsabah) {
      const furudhTotal = results?.reduce?.((acc: number, r: HeirResult) => acc + (r?.amount ?? 0), 0) ?? 0;
      const remainder = totalEstate - furudhTotal;

      if (remainder > 0) {
        // Distribute remainder to highest priority asabah
        const a = asabahList[0];
        if (a?.isMaleAsabah && a?.name?.includes?.('&')) {
          // Asabah bil-ghair: split into separate male & female entries with 2:1 ratio
          const totalParts = a?.count ?? 1; // sons*2 + daughters
          const perPart = remainder / totalParts;
          
          // Determine actual counts from name context
          let maleCount = 0;
          let femaleCount = 0;
          const nameL = (a?.name ?? '').toLowerCase();
          
          if (nameL.includes('anak')) {
            maleCount = heirs?.son ?? 0;
            femaleCount = heirs?.daughter ?? 0;
          } else if (nameL.includes('cucu')) {
            maleCount = heirs?.grandsonFromSon ?? 0;
            femaleCount = heirs?.granddaughterFromSon ?? 0;
          } else if (nameL.includes('kandung')) {
            maleCount = fullBrothers;
            femaleCount = fullSisters;
          } else if (nameL.includes('seayah')) {
            maleCount = patHalfBrothers;
            femaleCount = patHalfSisters;
          }
          
          if (maleCount > 0) {
            const maleTotal = perPart * 2 * maleCount;
            const malePer = perPart * 2;
            results.push({
              name: nameL.includes('anak') ? `Anak laki-laki` : nameL.includes('cucu') ? `Cucu laki-laki` : nameL.includes('kandung') ? `Saudara laki-laki kandung` : `Saudara laki-laki seayah`,
              count: maleCount,
              basis: a?.basis ?? '',
              shareFraction: `Ashabah (2:1)`,
              percentage: (maleTotal / totalEstate) * 100,
              amount: maleTotal,
              blocked: false,
              role: 'asabah'
            });
          }
          if (femaleCount > 0) {
            const femaleTotal = perPart * femaleCount;
            results.push({
              name: nameL.includes('anak') ? `Anak perempuan` : nameL.includes('cucu') ? `Cucu perempuan` : nameL.includes('kandung') ? `Saudara perempuan kandung` : `Saudara perempuan seayah`,
              count: femaleCount,
              basis: a?.basis ?? '',
              shareFraction: `Ashabah (2:1)`,
              percentage: (femaleTotal / totalEstate) * 100,
              amount: femaleTotal,
              blocked: false,
              role: 'asabah'
            });
          }
        } else {
          results.push({
            name: a?.name ?? '',
            count: a?.count ?? 1,
            basis: a?.basis ?? '',
            shareFraction: 'Sisa (Ashabah)',
            percentage: (remainder / totalEstate) * 100,
            amount: remainder,
            blocked: false,
            role: 'asabah'
          });
        }
      } else if (remainder <= 0 && !(totalFurudhNum > commonDen)) {
        // Asabah gets nothing
        for (const a of asabahList) {
          results.push({
            name: a?.name ?? '',
            count: a?.count ?? 1,
            basis: a?.basis ?? '',
            shareFraction: 'Asabah (tidak ada sisa)',
            percentage: 0,
            amount: 0,
            blocked: false,
            role: 'asabah'
          });
        }
      }
    }
  }

  // Add per-person info for shared heirs
  for (const r of results) {
    if ((r?.count ?? 0) > 1 && (r?.amount ?? 0) > 0) {
      const perPerson = r.amount / r.count;
      r.perPersonAmount = perPerson;
    }
  }

  return {
    heirs: results,
    totalEstate,
    aulOccurred,
    aulExplanation,
    raddOccurred,
    raddExplanation,
    blockedHeirs: blocked
  };
}

export function formatRupiah(num: number): string {
  return Math.round(num)?.toLocaleString?.('id-ID') ?? '0';
}

export function parseRupiah(str: string): number {
  const cleaned = (str ?? '')?.replace?.(/[^0-9]/g, '') ?? '';
  return parseInt(cleaned, 10) || 0;
}
