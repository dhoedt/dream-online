# Course Material Review: flashcards

Fact-check of every card in `site/_flashcards/acronymes.csv` (119 cards) and `site/_flashcards/questions.csv` (97 cards), reviewed on 2026-11-24.

## Summary Verdict

The cards are mostly sound, and changes are needed. Most definitions are correct and the level fits an introductory IT course. Two kinds of problem need fixing before students rely on them:

- **Errors that teach a wrong fact:** a missing "pas" that reverses the ASCII card; an outdated MSR size; Wi-Fi presented as an acronym; a wrong description of `Win + Ctrl + Q`; Print Screen behaviour that Windows 11 has changed; Secure Boot described as checking "firmwares"; and a TCP/IP layer named "Réseau", which clashes with the OSI layer of the same name.
- **Overstatements:** a MAC address presented as fixed and unique, and open source presented as code that is only "generally" modifiable.

The rest are clarity fixes, typos and redundant cards. Items marked "unconfirmed" are my own reading, which I could not confirm from an official source in this review. Check them before changing those cards.

Line numbers refer to the CSV files as they are now.

## Findings

### Factual errors

| Location | Issue | Severity | Explanation |
|---|---|---|---|
| acronymes.csv:119 (ASCII) | "il ne permet l'encodage de caractères spéciaux" | critical | The "pas" is missing, so the sentence says the opposite: that ASCII *can* encode accented characters. Also, the space character is printable (0x20), not a non-printable character. |
| acronymes.csv:28 (MSR) | "typiquement de 128 MB" | moderate | Since Windows 10, Microsoft documents the MSR as 16 MB. 128 MB was the size for Windows 7/8. "ne reçoit pas d'ID" is unclear: the MSR has a partition type GUID but gets no drive letter, which is probably what is meant. The card is also filed under Hardware, though it is a partitioning topic (OS). |
| acronymes.csv:60 (Wi-Fi) | "Wireless Fidelity" | moderate | Wi-Fi is a trademark, not an acronym. "Wireless Fidelity" is a backronym that the Wi-Fi Alliance does not use. Wi-Fi also connects devices to a local wireless network (WLAN), not to the Internet as such. |
| acronymes.csv:96 (Win + Ctrl + Q) | "met fin à une session de bureau virtuel selon le contexte" | moderate | `Win + Ctrl + Q` opens Quick Assist only. `Win + Ctrl + F4` closes a virtual desktop. |
| acronymes.csv:77 (PrtSc) | "Capture l'entièreté de l'écran" | moderate | Outdated for Windows 11. Since 2023, Print Screen opens the Snipping Tool by default; the old behaviour is a setting. On Windows 10, the key copies the whole screen to the clipboard, and nothing is saved. |
| questions.csv:67 (Secure Boot fill-in) | "ne permet de démarrer que sur des firmwares signés" | moderate | Secure Boot checks the signatures of boot loaders, UEFI drivers and option ROMs, not of "firmwares". Card 78 has the right definition ("code non signé"). |
| questions.csv:59 (TCP/IP layers) | "Réseau, Internet, Transport, et Application" | moderate | The lowest layer is usually called "Accès réseau" (Network Access / Link). Calling it "Réseau" clashes with the OSI "Réseau" layer, which matches the TCP/IP *Internet* layer. Students will mix the two up. |
| questions.csv:8 (chipset) | "gère les flux de données entre le CPU, la RAM…" | moderate | On every current platform the memory controller is in the CPU: RAM talks to the CPU directly, not through the chipset. The answer describes the old northbridge (card 14). Today's chipset (PCH) handles USB, SATA, extra PCIe lanes and other I/O. |
| questions.csv:56 (MAC vs IP), acronymes.csv:48 (MAC) | "adresse physique fixe unique à l'appareil"; "identifie de manière unique un hôte" | moderate | A MAC address belongs to a network interface (one device often has several), and it can be changed. Windows, Android and iOS randomise it on Wi-Fi by default. "Burned in by the maker, normally unique" is accurate. "Fixe" is not. |
| acronymes.csv:48 (MAC) | "Protocole de transfert de données" | moderate | MAC is a sublayer of the data link layer (layer 2), which controls access to the medium. It is not a protocol in itself. |
| questions.csv:87 (open source) | "il est aussi généralement modifiable et distribuable" | moderate | The right to modify and redistribute is what *defines* open source (Open Source Definition), not something that is "generally" true. Code that can only be read is "source-available". |
| questions.csv:55 (VM) | "dans une application qui émule le matériel" | moderate | Current hypervisors virtualise the hardware, with CPU support (VT-x/AMD-V); they mostly do not emulate it. Type 1 hypervisors (Hyper-V, ESXi) are not applications. The card is also filed under Réseau. |
| questions.csv:40 (UTP vs FTP) | "FTP … protégé … par une feuille d'aluminium" | moderate | Not wrong in everyday use, where "FTP" means one foil around the whole cable (F/UTP). But the acronymes cards (lines 39–65) use the ISO/IEC 11801 naming, where "FTP" after the slash means a foil *per pair*. Within the same course, the 2 meanings contradict each other. "Câble RJ45" names the connector, not the cable. |
| questions.csv:20 ("Périphérique USB inconnu") | "le plus souvent un problème de pilotes" | moderate, unconfirmed | "Unknown USB Device (Device Descriptor Request Failed)" usually means the device could not be enumerated: a cable, port, power or hardware fault. A missing driver usually shows as "Périphérique inconnu" under "Autres périphériques". |
| questions.csv:70 (Windows 11 firmware) | "le Secure Boot doit être activé" | moderate, unconfirmed | Microsoft's published requirement is "UEFI, Secure Boot capable". The PC must support Secure Boot; whether setup refuses to install with it turned off is not settled here. |
| acronymes.csv:21 (PSU) | "e.g. 120V" | minor | 120 V is the North American mains voltage. Belgian students use 230 V. |
| acronymes.csv:87 (Win + Pause) | "Afficher la fenêtre des propriétés système" | minor | Windows 10 (since 20H2) and Windows 11 open Settings > System > About; the old window is gone. |
| acronymes.csv:105 (Win + U) | "Ouvrir les options d'ergonomie" | minor | Windows 11 calls these the Accessibility settings ("Accessibilité"). |
| acronymes.csv:79 (Win + E), questions.csv:25 | "l'explorateur Windows" | minor | Called "Explorateur de fichiers" since Windows 8. The question card uses the current name. |
| acronymes.csv:88 (Win + Tab) | "Aero" for Vista/7, "Metro" for Windows 8 | minor | On Vista/7 the feature was Flip 3D (part of Aero). "Metro" is a design language; on Windows 8, `Win + Tab` opened the app switcher. "and" should be "et". |
| acronymes.csv:51 (OSI) | "jamais utilisé tel quel" | minor | OSI protocols were deployed (X.400, IS-IS, CLNP), though they lost to TCP/IP. "Rarely used as such" is accurate. "La suite IP" is usually called "la suite TCP/IP". |
| acronymes.csv:58 (U/UTP) | "Aucune mesure de protection contre les interférences" | minor | Twisting the pairs *is* a protection against interference. What is missing is shielding. |
| acronymes.csv:107 (BMP) | "non compressé" | minor | BMP is usually uncompressed, but the format supports RLE compression. |
| acronymes.csv:108 (BSOD) | "Un souci matériel avec un mauvais driver par exemple" | minor | Mixes 2 causes: a driver is software. "Par exemple un défaut matériel ou un pilote défectueux." |
| acronymes.csv:27 (BNC) | "Le câble réseau RJ45 le remplace" | minor | RJ45 is a connector. Twisted-pair cable with RJ45 connectors replaced coaxial cable with BNC connectors. |
| questions.csv:19 (1 GB) | 1 GB = 1 000 000 000 B | minor | Correct (SI). Worth adding that 1 GiB = 2³⁰ B, and that Windows shows GiB values labelled "Go". Otherwise students will wonder why a 1 TB disk shows as 931 Go. |
| questions.csv:36 (Legacy + GPT) | "Il faut alors reformater le disque" | minor | A disk is *converted* to MBR, which erases it, not "reformatted". The problem also applies to Windows: Linux can boot GPT in legacy mode. Same "formaté en GPT" wording at lines 64 and 83: partitioning is not formatting. |
| questions.csv:18 (dual channel) | "faisant fonctionner les 2 barrettes en même temps" | minor | Dual channel doubles the memory bus width (2 × 64 bits). The modules must sit in the right slots, one per channel. Identical pairs are recommended, not strictly required. |
| questions.csv:17 (définition) | "nombre total de pixels (ex: 1920x1080)" | minor | 1920×1080 is the size in pixels; the total is about 2.07 million. The definition/resolution distinction is right. |
| questions.csv:66 (TPM) | "La puce" | minor | The TPM can be built into the CPU's firmware (fTPM, Intel PTT) rather than a separate chip. |
| questions.csv:94 ("mémoire validée") | "mémoire virtuelle" | minor | The precise answer is the paging file (`pagefile.sys`). Virtual memory is the wider mechanism. The total is the "limite de validation". |
| questions.csv:96 (swap) | "données non utilisées" | minor | Pages that were not used recently, not unused data. |
| questions.csv:3 (CPU frequency) | "peut atteindre 5GHz" | minor | Some current desktop CPUs boost past 6 GHz. "Plus de 5 GHz" stays true longer. |

### Clarity and pedagogy

| Location | Issue | Severity | Explanation |
|---|---|---|---|
| acronymes.csv:59 (VPN) | The 2 examples are muddled | moderate | The company network is the private network being *extended*; the airport Wi-Fi is the untrusted network it is extended *across*. As written, the company network is listed as one of the untrusted networks. |
| questions.csv:57 (router) | "assure la connexion physique" | minor | A router connects networks at layer 3 (logical addressing). "Physical" connection is the job of the cable and the switch. |
| questions.csv:51 (hub/switch) | "relier les appareils connectés à un réseau" | minor | Circular wording ("connect devices connected to a network"). Hubs are obsolete; mention the switch first, or say "réseau local". |
| questions.csv:73–74, 64/83, 80/91, 79/81 | Near-duplicate cards | minor | CSM (2 cards), UEFI ↔ GPT (2), MBR extended partition (2) and BitLocker (2) each ask the same thing twice in the same deck. |
| Subjects | Cards in an unexpected subject | minor | MSR under Hardware, Bit/ANSI/ASCII under OS, HTML and VM under Réseau. They still teach the right thing, but students who look for them by subject will not find them. |
| questions.csv:30 (octet/byte) | "Il n'y en a pas" | minor | True today. Strictly, an octet is always 8 bits, while a byte was not always 8 bits. A short note would explain why standards say "octet". |

### Typos and formatting

| Location | Issue | Severity |
|---|---|---|
| questions.csv:30 | "dénominatin" → "dénomination" | minor |
| acronymes.csv:32 (DHCP) | "qui se connecte" → "qui se connectent" | minor |
| acronymes.csv:35 (LAN) | "Un LAN est réseau" → "est un réseau" | minor |
| acronymes.csv:48 (MAC) | "entres" → "entre"; "adressse" → "adresse" | minor |
| acronymes.csv:47 (IP) | "packets" → "paquets"; trailing space after "Internet Protocol" | minor |
| acronymes.csv:3 (BIOS) | "remplacé par le UEFI" → "par l'UEFI" | minor |
| acronymes.csv:22 (RTC) | missing comma: "éteint, typiquement" | minor |
| acronymes.csv:62 (WWW) | "chrome, firefox" → "Chrome, Firefox" | minor |
| acronymes.csv:68 | "Menu Windows Security" → "Sécurité Windows"; "Ouvrez" is the only card in the imperative | minor |
| acronymes.csv:109 (CLI) | "voire même" → "voire" | minor |
| questions.csv:3 | "giga hertz" → "gigahertz" | minor |
| questions.csv:13–14 | "vieilles carte mère" → "vieilles cartes mères" | minor |
| questions.csv:16 | "Qu'est ce que" → "Qu'est-ce que" | minor |
| questions.csv:4–5, 11 | "coeur" and "cœur" both used | minor |
| questions.csv:19 | "giga bytes" → "gigabytes" | minor |
| questions.csv:41 | "Windows update" → "Windows Update" | minor |
| questions.csv:58 | quote and parenthesis swapped: `Automatiquement)"` → `Automatiquement")` | minor |
| questions.csv:73 | "retro-compatibilité" → "rétrocompatibilité" | minor |
| questions.csv:82 | "déja" → "déjà"; the prompt is neither a question nor a fill-in (no "?" and no blank) | minor |

## Suggested Fixes

- **ASCII (acronymes:119):** "Assez restreint, il ne permet pas l'encodage de caractères accentués comme ceux du français." Move "espace" out of the non-printable examples.
- **MSR (acronymes:28):** "Sur Windows 10 et 11, la MSR fait 16 Mo (128 Mo sous Windows 7/8). Elle n'a pas de lettre de lecteur et ne peut pas contenir de données utilisateur." Move it to OS.
- **Wi-Fi (acronymes:60):** Back: "Marque de la Wi-Fi Alliance (pas un acronyme ; « Wireless Fidelity » est une invention marketing a posteriori)". Extra: "Réseau local sans fil (WLAN), norme IEEE 802.11."
- **Win + Ctrl + Q (acronymes:96):** Extra: "Ouvre l'Assistance rapide (Quick Assist), pour aider ou être aidé à distance."
- **PrtSc (acronymes:77):** "Windows 10 : copie tout l'écran dans le presse-papiers. Windows 11 : ouvre l'Outil Capture par défaut."
- **Secure Boot (questions:67):** "…qui ne permet de démarrer que des chargeurs de démarrage et pilotes signés numériquement."
- **TCP/IP (questions:59):** "Accès réseau, Internet, Transport, Application." Optionally add "(la couche Internet correspond à la couche Réseau du modèle OSI)".
- **Chipset (questions:8):** "Il relie le CPU aux périphériques et contrôleurs plus lents (USB, SATA, lignes PCIe supplémentaires). Sur les PC actuels, la RAM est reliée directement au CPU."
- **MAC (questions:56, acronymes:48):** "L'adresse MAC identifie une interface réseau ; elle est attribuée par le fabricant mais peut être modifiée (ex : adresses aléatoires en Wi-Fi). L'adresse IP est logique et dépend du réseau." Acronymes Back extra: "Sous-couche de la couche liaison de données qui contrôle l'accès au support."
- **Open source (questions:87):** "Son code source est accessible, et sa licence autorise à le modifier et à le redistribuer."
- **VM (questions:55):** "…tandis que la machine virtuelle exécute un OS sur du matériel virtualisé par un hyperviseur (ex : Hyper-V, VirtualBox)." Move it to OS.
- **UTP vs FTP (questions:40):** Either use the ISO naming ("U/UTP vs F/UTP") or state that it is the everyday name for F/UTP, so the card matches the acronymes cards. Replace "câble RJ45" with "câble à paires torsadées".
- **VPN (acronymes:59):** "…permettant d'étendre un réseau privé (ex : le réseau d'une entreprise) à travers un réseau non fiable (ex : le Wi-Fi public d'un aéroport)."
- **Unconfirmed items (questions:20 and 70):** check against Microsoft's documentation before editing.
