// Calculs et explications partagés par l'exercice et la leçon sur le masque de sous-réseau.

const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

const BINARY_OCTET = {
  cssClass: 'binary',
  maxLength: 8,
  pattern: /^[01]{8}$/,
  radix: 2,
  maxValue: 255,
  formatHelp: 'chaque octet binaire doit contenir exactement 8 chiffres 0 ou 1',
};

const DECIMAL_OCTET = {
  cssClass: 'decimal',
  maxLength: 3,
  pattern: /^(0|[1-9]\d{0,2})$/,
  radix: 10,
  maxValue: 255,
  formatHelp: 'chaque octet décimal doit être un entier entre 0 et 255, sans zéro superflu',
};

const HOST_COUNT = {
  cssClass: 'count',
  maxLength: 6,
  pattern: /^(0|[1-9]\d*)$/,
  radix: 10,
  maxValue: Infinity,
  formatHelp: 'le nombre d\'hôtes doit être un entier, sans espace ni zéro superflu',
};

const QUESTIONS = [
  {
    title: 'Quelle est la forme binaire de l\'adresse IPv4&nbsp;?',
    groups: [
      { label: 'Adresse IPv4 (binaire)', format: BINARY_OCTET, fieldCount: 4, expected: (exercise) => intToOctets(exercise.address) },
    ],
    hint: `
      <ol>
        <li>Convertissez chaque octet de l'adresse séparément (ne tenez pas compte du <code>/n</code>).</li>
        <li>Divisez l'octet par 2. Si la division est entière (pas de décimale), notez <strong>0</strong>&nbsp;; si elle ne l'est pas (résultat en <code>,5</code>), notez <strong>1</strong>.</li>
        <li>Recommencez avec le résultat, sans sa décimale (<code>6,5</code> devient <code>6</code>), jusqu'à la division <code>1 ÷ 2</code>.</li>
        <li>Lisez les bits notés du dernier au premier&nbsp;: ce sont les bits de l'octet, de gauche à droite.</li>
        <li>Chaque octet doit compter exactement 8 bits&nbsp;: complétez à gauche avec des 0 si nécessaire.</li>
      </ol>`,
    explain: (exercise) => explainAddressBinaryConversion(exercise.address),
  },
  {
    title: 'Quel est le masque de sous-réseau&nbsp;?',
    groups: [
      { label: 'Forme binaire', format: BINARY_OCTET, fieldCount: 4, expected: (exercise) => intToOctets(exercise.mask) },
      { label: 'Forme décimale', format: DECIMAL_OCTET, fieldCount: 4, expected: (exercise) => intToOctets(exercise.mask) },
    ],
    hint: `
      <ol>
        <li>Son masque de sous-réseau (subnet mask) <code>/n</code> indique le nombre de bits à 1 au début du masque&nbsp;: écrivez <code>n</code> bits à 1, puis complétez avec des 0 jusqu'à 32 bits.</li>
        <li>Découpez ces 32 bits en 4 octets (4 groupes de 8 bits).</li>
        <li>Convertissez chaque octet en décimal, avec la technique du tableau, en additionnant les poids des bits à 1&nbsp;:<br> <code>128, 64, 32, 16, 8, 4, 2, 1</code>.</li>
      </ol>`,
    explain: (exercise) => `
      <ol>
        <li>Le préfixe <code>/${exercise.prefix}</code> signifie que les ${exercise.prefix} premiers bits du masque valent 1 et que les ${exercise.hostBits} bits restants (32 − ${exercise.prefix}) valent 0.</li>
        <li>Découpés en 4 octets, ces 32 bits donnent la forme binaire&nbsp;:
          ${renderBinaryTable([{ label: 'Masque', value: exercise.mask }], exercise.prefix)}
        </li>
        <li>${explainMaskDecimalConversion(exercise.mask)}</li>
      </ol>
      <p class="final-answer">Masque&nbsp;: <strong>${formatBinaryDotted(exercise.mask)}</strong>,<br>soit <strong>${formatDotted(exercise.mask)}</strong>.</p>`,
  },
  {
    title: 'Combien d\'hôtes peut-on adresser sur ce réseau&nbsp;?',
    groups: [
      { label: 'Nombre d\'hôtes utilisables', format: HOST_COUNT, fieldCount: 1, expected: (exercise) => [exercise.usableHosts] },
    ],
    hint: `
      <ol>
        <li>Comptez les bits réservés aux hôtes&nbsp;: <code>32 − n</code>, où <code>n</code> est la son masque de sous-réseau (subnet mask).</li>
        <li>Le sous-réseau contient <code>2<sup>(32 − n)</sup></code> adresses au total.</li>
        <li>Deux adresses ne peuvent pas être attribuées à une machine&nbsp;: l'adresse réseau (la première) et l'adresse de diffusion (la dernière). Retirez-les.</li>
      </ol>`,
    explain: (exercise) => `
      <ol>
        <li>Bits d'hôte&nbsp;: <code>32 − ${exercise.prefix} = ${exercise.hostBits}</code>.</li>
        <li>Nombre total d'adresses du sous-réseau&nbsp;: <code>2<sup>${exercise.hostBits}</sup> = ${exercise.usableHosts + 2}</code>.</li>
        <li>On retire l'adresse réseau et l'adresse de diffusion&nbsp;: <code>${exercise.usableHosts + 2} − 2 = ${exercise.usableHosts}</code>.</li>
      </ol>
      <p class="final-answer">Nombre d'hôtes utilisables&nbsp;: <strong>${exercise.usableHosts}</strong>.</p>`,
  },
  {
    title: 'Quelle est l\'adresse réseau (network address)&nbsp;?',
    groups: [
      { label: 'Adresse réseau (décimal)', format: DECIMAL_OCTET, fieldCount: 4, expected: (exercise) => intToOctets(exercise.network) },
    ],
    hint: `
      <ol>
        <li>Écrivez l'adresse IP et le masque en binaire, l'un sous l'autre.</li>
        <li>Appliquez un ET logique bit à bit&nbsp;: le résultat vaut 1 uniquement si les deux bits valent 1.</li>
        <li>Autrement dit&nbsp;: les bits réseau de l'adresse sont conservés et tous les bits d'hôte passent à 0.</li>
        <li>Reconvertissez chaque octet du résultat en décimal.</li>
      </ol>
      <p>Astuce&nbsp;: un octet du masque à 255 recopie l'octet de l'adresse, un octet à 0 donne 0. Seul l'octet «&nbsp;coupé&nbsp;» par le masque demande un calcul en binaire.</p>`,
    explain: (exercise) => `
      <p>On applique un ET logique bit à bit entre l'adresse et le masque&nbsp;:</p>
      ${renderBinaryTable([
        { label: 'Adresse', value: exercise.address },
        { label: 'Masque', value: exercise.mask },
        { label: 'Réseau', value: exercise.network, isResult: true },
      ], exercise.prefix)}
      <p>Les ${exercise.prefix} bits réseau de l'adresse sont conservés, les ${exercise.hostBits} bits d'hôte passent à 0.</p>
      <p class="final-answer">Adresse réseau&nbsp;: <strong>${formatDotted(exercise.network)}</strong>.</p>`,
  },
  {
    title: 'Quelle est l\'adresse de diffusion (broadcast address)&nbsp;?',
    groups: [
      { label: 'Adresse de diffusion (décimal)', format: DECIMAL_OCTET, fieldCount: 4, expected: (exercise) => intToOctets(exercise.broadcast) },
    ],
    hint: `
      <ol>
        <li>Écrivez l'adresse IP en binaire et repérez la frontière entre bits réseau et bits d'hôte grâce au masque.</li>
        <li>Conservez les bits réseau tels quels et mettez tous les bits d'hôte à 1.</li>
        <li>Reconvertissez chaque octet du résultat en décimal.</li>
      </ol>`,
    explain: (exercise) => `
      <p>On conserve les bits réseau de l'adresse et on met tous les bits d'hôte à 1&nbsp;:</p>
      ${renderBinaryTable([
        { label: 'Adresse', value: exercise.address },
        { label: 'Masque', value: exercise.mask },
        { label: 'Diffusion', value: exercise.broadcast, isResult: true },
      ], exercise.prefix)}
      <p>Les ${exercise.prefix} bits réseau sont inchangés, les ${exercise.hostBits} bits d'hôte valent tous 1.</p>
      <p class="final-answer">Adresse de diffusion&nbsp;: <strong>${formatDotted(exercise.broadcast)}</strong>.</p>`,
  },
];

function octetsToInt(octets) {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

function intToOctets(value) {
  return [value >>> 24, (value >>> 16) & 255, (value >>> 8) & 255, value & 255];
}

function octetToBinary(octet) {
  return octet.toString(2).padStart(8, '0');
}

function formatDotted(value) {
  return intToOctets(value).join('.');
}

function formatBinaryDotted(value) {
  return intToOctets(value).map(octetToBinary).join('.');
}

function prefixToMask(prefix) {
  return (0xFFFFFFFF << (32 - prefix)) >>> 0;
}

function createExercise(address, prefix) {
  const mask = prefixToMask(prefix);
  const hostBits = 32 - prefix;
  const network = (address & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  return { address, prefix, mask, hostBits, network, broadcast, usableHosts: 2 ** hostBits - 2 };
}

function renderWeightTable(octet) {
  const cellClass = (weight) => (octet & weight ? ' class="is-set"' : '');
  const weightCells = BIT_WEIGHTS.map((weight) => `<td${cellClass(weight)}>${weight}</td>`).join('');
  const bitCells = BIT_WEIGHTS.map((weight) => `<td${cellClass(weight)}>${octet & weight ? 1 : 0}</td>`).join('');
  return `
    <div class="binary-scroll">
      <table class="weight-table">
        <tbody>
          <tr><th scope="row">Poids</th>${weightCells}</tr>
          <tr><th scope="row">Bit</th>${bitCells}</tr>
        </tbody>
      </table>
    </div>`;
}

function explainAddressBinaryConversion(address) {
  // Seul le premier octet est détaillé pas à pas ; il vaut 10, 172 ou 192, donc jamais 0.
  const [firstOctet, ...otherOctets] = intToOctets(address);
  const bits = [];
  let divisionRows = '';
  for (let dividend = firstOctet; dividend > 0; dividend = Math.floor(dividend / 2)) {
    const bit = dividend % 2;
    bits.push(bit);
    divisionRows += `<tr><td>${dividend} ÷ 2</td><td>${Math.floor(dividend / 2)}${bit ? ',5' : ''}</td><td class="is-set">${bit}</td></tr>`;
  }
  const significantBits = [...bits].reverse().join('');
  const padding = significantBits.length < 8
    ? `<br>Un octet compte toujours 8 bits&nbsp;: on complète à gauche avec ${8 - significantBits.length} zéro(s), ce qui ne change pas la valeur.`
    : '';
  // Un octet qui compte moins de 8 bits significatifs montre l'étape intermédiaire avant le complément à gauche.
  const needsPadding = (octet) => octet.toString(2).length < 8;
  const otherConversions = otherOctets
    .map((octet) => {
      const unpadded = needsPadding(octet) ? ` → <code>${octet.toString(2)}</code>` : '';
      return `<li><code>${octet}</code>${unpadded} → <code><strong>${octetToBinary(octet)}</strong></code></li>`;
    })
    .join('');
  const paddingNote = otherOctets.some(needsPadding)
    ? '<p>Un octet s\'écrit toujours avec <strong>8 bits</strong>. Un petit nombre converti en binaire peut en compter moins&nbsp;: on complète alors à gauche avec des 0, ce qui ne change pas sa valeur.</p>'
    : '';
  const decimalCells = intToOctets(address).map((octet) => `<td>${octet}</td>`).join('');
  const binaryCells = intToOctets(address).map((octet) => `<td class="is-set">${octetToBinary(octet)}</td>`).join('');
  return `
    <p>On convertit chaque octet séparément, par divisions successives par 2.<br>Détail pour le premier octet, <code>${firstOctet}</code>&nbsp;:</p>
    <ul>
      <li>«&nbsp;Division&nbsp;»&nbsp;: l'octet, puis le résultat précédent sans sa décimale (<code>6,5</code> devient <code>6</code>).</li>
      <li>«&nbsp;Bit&nbsp;»&nbsp;: <strong>0</strong> si le résultat est entier, <strong>1</strong> s'il se termine par <code>,5</code>.</li>
    </ul>
    <p>On divise jusqu'à obtenir le résultat 0, car il ne reste alors plus rien à diviser&nbsp;:</p>
    <div class="binary-scroll">
      <table class="weight-table">
        <thead><tr><th scope="col">Division</th><th scope="col">Résultat</th><th scope="col">Bit</th></tr></thead>
        <tbody>${divisionRows}</tbody>
      </table>
    </div>
    <p>On lit la colonne «&nbsp;Bit&nbsp;» de bas en haut&nbsp;: <code>${significantBits}</code>.${padding}</p>
    <p><code>${firstOctet}</code> → <code><strong>${octetToBinary(firstOctet)}</strong></code></p>
    <p>Les trois autres octets se convertissent de la même manière&nbsp;:</p>
    <ul>${otherConversions}</ul>
    ${paddingNote}
    <p>L'adresse complète, octet par octet, en décimal (au-dessus) et en binaire (en dessous)&nbsp;:</p>
    <div class="binary-scroll">
      <table class="weight-table">
        <tbody>
          <tr><th scope="row">Décimal</th>${decimalCells}</tr>
          <tr><th scope="row">Binaire</th>${binaryCells}</tr>
        </tbody>
      </table>
    </div>
    <p class="final-answer">Adresse&nbsp;: <strong>${formatDotted(address)}</strong><br>en binaire&nbsp;: <strong>${formatBinaryDotted(address)}</strong>.</p>`;
}

function explainMaskDecimalConversion(mask) {
  const octets = intToOctets(mask);
  // Seul l'octet « coupé » par le préfixe demande un calcul ; avec /24 il n'y en a pas, on détaille alors 255.
  const partialOctet = octets.find((octet) => octet !== 0 && octet !== 255);
  const detailedOctet = partialOctet ?? 255;
  const setWeights = BIT_WEIGHTS.filter((weight) => detailedOctet & weight);
  const introduction = partialOctet === undefined
    ? 'Représentation décimale&nbsp;: ici, chaque octet vaut <code>11111111</code> ou <code>00000000</code>. Un octet <code>00000000</code> vaut 0.'
    : `Représentation décimale&nbsp;:<br>Un octet <code>11111111</code> vaut 255.<br>Un octet <code>00000000</code> vaut 0.<br>Il reste à convertir <code>${octetToBinary(partialOctet)}</code>.`;
  return `
    ${introduction}
    <p>Méthode du tableau pour trouver la valeur décimale de <code>${octetToBinary(detailedOctet)}</code>&nbsp;:<br>On écrit chaque bit sous son poids :</p>
    ${renderWeightTable(detailedOctet)}
    <p>On additionne les poids situés au-dessus des 1&nbsp;:<br><code>${setWeights.join(' + ')} = <strong>${detailedOctet}</strong></code></p>`;
}

function renderBits(value, prefix) {
  const bits = value.toString(2).padStart(32, '0');
  let networkPart = '';
  let hostPart = '';
  for (let i = 0; i < 32; i++) {
    const separator = i > 0 && i % 8 === 0 ? '.' : '';
    if (i < prefix) {
      networkPart += separator + bits[i];
    } else {
      hostPart += separator + bits[i];
    }
  }
  return `<span class="bits-network">${networkPart}</span><span class="bits-host">${hostPart}</span>`;
}

function renderBinaryTable(rows, prefix) {
  const body = rows.map((row) => `
    <tr class="${row.isResult ? 'result-row' : ''}">
      <th scope="row">${row.label}</th>
      <td>${renderBits(row.value, prefix)}</td>
      <td>${formatDotted(row.value)}</td>
    </tr>`).join('');
  return `
    <div class="binary-scroll"><table class="binary-table"><tbody>${body}</tbody></table></div>
    <p class="legend"><span class="bits-network">Bits réseau</span> (${prefix}) · <span class="bits-host">bits d'hôte</span> (${32 - prefix})</p>`;
}
