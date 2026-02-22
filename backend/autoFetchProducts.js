const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    productImage: [],
    description: String,
    price: Number,
    sellingPrice: Number
}, { timestamps: true });

const productModel = mongoose.model("product", productSchema);

const rawProducts = [
    // ==================== MOBILES (10) ====================
    { productName: "Apple iPhone 15 Pro Max", brandName: "Apple", category: "mobiles", productImage: ["/images/products/mobile/Apple iPhone 15 Pro Max.jpg"], description: "6.7-inch Super Retina XDR, A17 Pro chip, 48MP camera, Titanium design", price: 159900, sellingPrice: 144900 },
    { productName: "Samsung Galaxy S24 Ultra", brandName: "Samsung", category: "mobiles", productImage: ["/images/products/mobile/Samsung Galaxy S24 Ultra.jpg"], description: "6.8-inch QHD+ AMOLED, Snapdragon 8 Gen 3, 200MP camera, S Pen included", price: 134999, sellingPrice: 119999 },
    { productName: "OnePlus 12", brandName: "OnePlus", category: "mobiles", productImage: ["/images/products/mobile/OnePlus 12.jpg"], description: "6.82-inch AMOLED, Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W charging", price: 64999, sellingPrice: 59999 },
    { productName: "Google Pixel 8 Pro", brandName: "Google", category: "mobiles", productImage: ["/images/products/mobile/Google Pixel 8 Pro.jpg"], description: "6.7-inch OLED, Google Tensor G3, 50MP camera, 7 years of updates", price: 106999, sellingPrice: 94999 },
    { productName: "Xiaomi 14 Pro", brandName: "Xiaomi", category: "mobiles", productImage: ["/images/products/mobile/Xiaomi 14 Pro.jpg"], description: "6.73-inch AMOLED, Snapdragon 8 Gen 3, Leica 50MP camera, 120W HyperCharge", price: 89999, sellingPrice: 79999 },
    { productName: "Realme GT 5 Pro", brandName: "Realme", category: "mobiles", productImage: ["/images/products/mobile/Realme GT 5 Pro.jpg"], description: "6.78-inch AMOLED, Snapdragon 8 Gen 3, 50MP Sony IMX890, 240W charging", price: 53999, sellingPrice: 47999 },
    { productName: "Vivo X100 Pro", brandName: "Vivo", category: "mobiles", productImage: ["/images/products/mobile/Vivo X100 Pro.webp"], description: "6.78-inch AMOLED, Dimensity 9300, Zeiss 50MP camera, 100W charging", price: 89999, sellingPrice: 82999 },
    { productName: "Nothing Phone 2a", brandName: "Nothing", category: "mobiles", productImage: ["/images/products/mobile/Nothing Phone 2a.jpg"], description: "6.7-inch AMOLED, Dimensity 7200 Pro, 50MP camera, Glyph Interface", price: 23999, sellingPrice: 20999 },
    { productName: "Redmi Note 13 Pro+", brandName: "Redmi", category: "mobiles", productImage: ["/images/products/mobile/Radmi.jpg"], description: "6.67-inch AMOLED, Dimensity 7200, 200MP camera, 120W HyperCharge", price: 31999, sellingPrice: 27999 },
    { productName: "iQOO 12", brandName: "iQOO", category: "mobiles", productImage: ["/images/products/mobile/iQOO 12.webp"], description: "6.78-inch AMOLED, Snapdragon 8 Gen 3, 50MP IMX920, 120W FlashCharge", price: 52999, sellingPrice: 47999 },

    // ==================== AIRPODES (10) ====================
    { productName: "Apple AirPods Pro 2nd Gen", brandName: "Apple", category: "airpodes", productImage: ["/images/products/airpodes/Apple AirPods Pro 2nd Gen.webp"], description: "Active Noise Cancellation, Transparency Mode, Adaptive Audio, H2 chip", price: 24900, sellingPrice: 19900 },
    { productName: "Samsung Galaxy Buds 3 Pro", brandName: "Samsung", category: "airpodes", productImage: ["/images/products/airpodes/Samsung Galaxy Buds 3 Pro.png"], description: "ANC, 360 Audio, Blade Idle Design, 6 hours battery", price: 19999, sellingPrice: 16999 },
    { productName: "boAt Airdopes 141", brandName: "boAt", category: "airpodes", productImage: ["/images/products/airpodes/boAt Airdopes 141.jpg"], description: "42H total playback, ENx Tech, Beast Mode, ASAP Charge, IPX4", price: 2999, sellingPrice: 1299 },
    { productName: "Sony WF-1000XM5", brandName: "Sony", category: "airpodes", productImage: ["/images/products/airpodes/Sony WF-1000XM5.jpg"], description: "Industry-leading ANC, 8 hours battery, LDAC, Multipoint connection", price: 29990, sellingPrice: 24990 },
    { productName: "Nothing Ear 2", brandName: "Nothing", category: "airpodes", productImage: ["/images/products/airpodes/Nothing Ear 2.webp"], description: "ANC, Transparent design, 36 hours total, Hi-Res Audio, IP54", price: 9999, sellingPrice: 7999 },
    { productName: "OnePlus Buds Pro 2", brandName: "OnePlus", category: "airpodes", productImage: ["/images/products/airpodes/OnePlus Buds Pro 2.jpg"], description: "ANC, Spatial Audio, 39 hours total, LHDC 5.0, IP55", price: 11999, sellingPrice: 9499 },
    { productName: "Realme Buds Air 5 Pro", brandName: "Realme", category: "airpodes", productImage: ["/images/products/airpodes/Realme Buds Air 5 Pro.webp"], description: "50dB ANC, 360 Spatial Audio, 38 hours total, 48kHz Hi-Res Audio", price: 5999, sellingPrice: 4499 },
    { productName: "Noise Buds VS104", brandName: "Noise", category: "airpodes", productImage: ["/images/products/airpodes/Noise Buds VS104.jpg"], description: "ANC, 50H playtime, Quad Mic, Gaming mode, IPX5", price: 3499, sellingPrice: 1799 },
    { productName: "JBL Tour Pro 2", brandName: "JBL", category: "airpodes", productImage: ["/images/products/airpodes/JBL Tour Pro 2.jpg"], description: "Smart Charging Case, ANC, 40 hours total", price: 19999, sellingPrice: 16499 },
    { productName: "Bose QuietComfort Earbuds II", brandName: "Bose", category: "airpodes", productImage: ["/images/products/airpodes/Bose QuietComfort Earbuds II.jpg"], description: "Best ANC earbuds, CustomTune technology, 6 hours + 18 hours", price: 26900, sellingPrice: 21900 },

    // ==================== WATCHES (10) ====================
    { productName: "Apple Watch Series 9 GPS 45mm", brandName: "Apple", category: "watches", productImage: ["/images/products/watches/Apple Watch Series 9 GPS 45mm.webp"], description: "Always-On Retina display, S9 chip, Double Tap gesture, Blood Oxygen, ECG", price: 44900, sellingPrice: 41900 },
    { productName: "Samsung Galaxy Watch 6 Classic", brandName: "Samsung", category: "watches", productImage: ["/images/products/watches/Samsung Galaxy Watch 6 Classic.webp"], description: "Rotating Bezel, 1.5-inch Super AMOLED, BP Monitor, ECG, 40 hours battery", price: 39999, sellingPrice: 32999 },
    { productName: "Noise ColorFit Pro 4 Alpha", brandName: "Noise", category: "watches", productImage: ["/images/products/watches/Noise ColorFit Pro 4 Alpha.jpg"], description: "1.78 AMOLED, Bluetooth Calling, 100+ Sports Modes, SpO2, Heart Rate", price: 5999, sellingPrice: 2499 },
    { productName: "Fire-Boltt Phoenix Ultra", brandName: "Fire-Boltt", category: "watches", productImage: ["/images/products/watches/Fire-Boltt Phoenix Ultra.jpg"], description: "1.39 inch Round AMOLED, Bluetooth Calling, 120+ Sports Modes, SpO2", price: 7999, sellingPrice: 1999 },
    { productName: "Amazfit GTR 4", brandName: "Amazfit", category: "watches", productImage: ["/images/products/watches/Amazfit GTR 4.webp"], description: "1.43-inch AMOLED, Built-in Alexa, 150+ Sports Modes, 14 days battery", price: 14999, sellingPrice: 11999 },
    { productName: "Garmin Fenix 7 Pro", brandName: "Garmin", category: "watches", productImage: ["/images/products/watches/Garmin Fenix 7 Pro.webp"], description: "Solar charging, Multi-band GPS, 22 days battery, Topographic maps", price: 89990, sellingPrice: 79990 },
    { productName: "Fitbit Charge 6", brandName: "Fitbit", category: "watches", productImage: ["/images/products/watches/Fitbit Charge 6.jpg"], description: "Built-in GPS, Google Maps, 7 days battery, ECG, SpO2", price: 14999, sellingPrice: 12999 },
    { productName: "boAt Wave Sigma", brandName: "boAt", category: "watches", productImage: ["/images/products/watches/boAt Wave Sigma.webp"], description: "1.85-inch display, Bluetooth Calling, 7 days battery, IP68", price: 2999, sellingPrice: 1499 },
    { productName: "Redmi Watch 4", brandName: "Redmi", category: "watches", productImage: ["/images/products/watches/Redmi Watch 4.jpg"], description: "1.97-inch AMOLED, Bluetooth Calling, 20 days battery, 150+ sports", price: 4999, sellingPrice: 3999 },
    { productName: "OnePlus Watch 2", brandName: "OnePlus", category: "watches", productImage: ["/images/products/watches/OnePlus Watch 2.jpg"], description: "Wear OS, 1.43-inch AMOLED, 100 hours battery, Dual OS, GPS", price: 26999, sellingPrice: 22999 },

    // ==================== MOUSE (10) ====================
    { productName: "Logitech MX Master 3S", brandName: "Logitech", category: "mouse", productImage: ["/images/products/mouse/Logitech MX Master 3S.jpg"], description: "8000 DPI, Quiet clicks, MagSpeed scroll, USB-C, Multi-device, Ergonomic", price: 8995, sellingPrice: 7495 },
    { productName: "Razer DeathAdder V3 Pro", brandName: "Razer", category: "mouse", productImage: ["/images/products/mouse/Razer DeathAdder V3 Pro.webp"], description: "30000 DPI Focus Pro sensor, 90g lightweight, 90 hours battery", price: 14999, sellingPrice: 12999 },
    { productName: "Logitech G502 X Plus", brandName: "Logitech", category: "mouse", productImage: ["/images/products/mouse/Logitech G502 X Plus.webp"], description: "HERO 25K sensor, LIGHTSPEED wireless, LIGHTSYNC RGB, 13 programmable buttons", price: 13995, sellingPrice: 11495 },
    { productName: "Apple Magic Mouse", brandName: "Apple", category: "mouse", productImage: ["/images/products/mouse/Apple Magic Mouse.jpg"], description: "Multi-Touch surface, Bluetooth, Rechargeable, Sleek aluminum design", price: 7500, sellingPrice: 6500 },
    { productName: "HP X1000 Wired Mouse", brandName: "HP", category: "mouse", productImage: ["/images/products/mouse/HP X1000 Wired Mouse.jpg"], description: "1600 DPI, Ergonomic design, USB, Plug and Play", price: 599, sellingPrice: 399 },
    { productName: "Razer Basilisk V3 Pro", brandName: "Razer", category: "mouse", productImage: ["/images/products/mouse/Razer Basilisk V3 Pro.webp"], description: "HyperScroll Tilt Wheel, 30K DPI, LIGHTSPEED, Chroma RGB", price: 12999, sellingPrice: 10999 },
    { productName: "Logitech G Pro X Superlight 2", brandName: "Logitech", category: "mouse", productImage: ["/images/products/mouse/Logitech G Pro X Superlight 2.png"], description: "HERO 2 sensor 32K DPI, 60g ultralight, LIGHTSPEED", price: 12995, sellingPrice: 10995 },
    { productName: "Microsoft Arc Mouse", brandName: "Microsoft", category: "mouse", productImage: ["/images/products/mouse/Microsoft Arc Mouse.jpg"], description: "Foldable design, Bluetooth, Arc touch scroll, Slim & portable", price: 5695, sellingPrice: 4695 },
    { productName: "Dell MS3320W Wireless Mouse", brandName: "Dell", category: "mouse", productImage: ["/images/products/mouse/Dell MS3320W Wireless Mouse.jpg"], description: "1600 DPI, Bluetooth + USB, 36 months battery", price: 2999, sellingPrice: 2299 },
    { productName: "Xiaomi Wireless Mouse 2", brandName: "Xiaomi", category: "mouse", productImage: ["/images/products/mouse/Xiaomi Wireless Mouse 2.jpg"], description: "1200 DPI, 2.4GHz wireless, 12 months battery, Silent click", price: 999, sellingPrice: 699 },

    // ==================== TELEVISIONS (10) ====================
    { productName: "Samsung 55-inch Neo QLED 4K TV", brandName: "Samsung", category: "televisions", productImage: ["/images/products/TV/Samsung 55-inch Neo QLED 4K TV.jpg"], description: "Neo QLED, Quantum HDR 32x, Gaming Hub, Tizen OS", price: 119900, sellingPrice: 94900 },
    { productName: "LG OLED C3 65-inch", brandName: "LG", category: "televisions", productImage: ["/images/products/TV/LG OLED C3 65-inch.webp"], description: "OLED evo, α9 AI Processor, Dolby Vision IQ, G-Sync, FreeSync", price: 229900, sellingPrice: 189900 },
    { productName: "Sony Bravia XR 55 X90L", brandName: "Sony", category: "televisions", productImage: ["/images/products/TV/Sony Bravia XR 55 X90L.webp"], description: "Full Array LED, XR Processor, Dolby Vision & Atmos, Google TV", price: 139900, sellingPrice: 109900 },
    { productName: "Mi 43-inch 4K Smart TV", brandName: "Mi", category: "televisions", productImage: ["/images/products/TV/Mi 43-inch 4K Smart TV.jpg"], description: "4K Ultra HD, Android TV, Dolby Audio, 20W speaker", price: 32999, sellingPrice: 26999 },
    { productName: "OnePlus 55 Q2 Pro QLED TV", brandName: "OnePlus", category: "televisions", productImage: ["/images/products/TV/OnePlus 55 Q2 Pro QLED TV.jpg"], description: "QLED, 120Hz, Dolby Vision IQ, Gamma Engine", price: 79999, sellingPrice: 64999 },
    { productName: "TCL 55-inch C835 Mini LED", brandName: "TCL", category: "televisions", productImage: ["/images/products/TV/TCL 55-inch C835 Mini LED.jpg"], description: "Mini LED, 4K, 144Hz, QLED, Dolby Vision IQ, Google TV", price: 89999, sellingPrice: 72999 },
    { productName: "Redmi 32-inch HD Ready Smart TV", brandName: "Redmi", category: "televisions", productImage: ["/images/products/TV/Redmi 32-inch HD Ready Smart TV.jpg"], description: "HD Ready, Android TV 11, 20W speakers, Chromecast", price: 13999, sellingPrice: 10999 },
    { productName: "Hisense 65-inch U8K Mini LED", brandName: "Hisense", category: "televisions", productImage: ["/images/products/TV/Hisense 65-inch U8K Mini LED.jpg"], description: "Mini LED ULED, 144Hz, Dolby Vision, IMAX Enhanced, Google TV", price: 129999, sellingPrice: 104999 },
    { productName: "Vu 75-inch Premium 4K TV", brandName: "Vu", category: "televisions", productImage: ["/images/products/TV/Vu 75-inch Premium 4K TV.jpg"], description: "4K QLED, 60Hz, Dolby Audio, Android TV, 40W speakers", price: 79999, sellingPrice: 62999 },
    { productName: "Realme 43-inch 4K Smart TV", brandName: "Realme", category: "televisions", productImage: ["/images/products/TV/Realme 43-inch 4K Smart TV.jpg"], description: "4K Ultra HD, Android TV, 24W speakers, Chroma Boost", price: 32999, sellingPrice: 26999 },

    // ==================== CAMERA (10) ====================
    { productName: "Canon EOS R6 Mark II", brandName: "Canon", category: "camera", productImage: ["/images/products/camera/Canon EOS R6 Mark II.jpg"], description: "40MP Full Frame, 40fps burst, 4K 60p, IBIS", price: 239995, sellingPrice: 219995 },
    { productName: "Sony Alpha A7 IV", brandName: "Sony", category: "camera", productImage: ["/images/products/camera/Sony Alpha A7 IV.jpg"], description: "33MP BSI Full Frame, 4K 60p, Real-time tracking AF", price: 259990, sellingPrice: 234990 },
    { productName: "Nikon Z8", brandName: "Nikon", category: "camera", productImage: ["/images/products/camera/Nikon Z8.jpg"], description: "45.7MP BSI CMOS, 8K RAW video, 20fps, Eye AF", price: 349995, sellingPrice: 319995 },
    { productName: "GoPro HERO 12 Black", brandName: "GoPro", category: "camera", productImage: ["/images/products/camera/GoPro HERO 12 Black.jpg"], description: "5.3K60 Video, HyperSmooth 6.0, Waterproof 10m", price: 44990, sellingPrice: 39990 },
    { productName: "Fujifilm X-T5", brandName: "Fujifilm", category: "camera", productImage: ["/images/products/camera/Fujifilm X-T5.jpg"], description: "40.2MP X-Trans CMOS 5 HR, 6.2K video, IBIS", price: 169999, sellingPrice: 154999 },
    { productName: "DJI Osmo Pocket 3", brandName: "DJI", category: "camera", productImage: ["/images/products/camera/DJI Osmo Pocket 3.jpg"], description: "1-inch CMOS, 4K 120fps, 3-axis stabilization, OLED touchscreen", price: 59990, sellingPrice: 54990 },
    { productName: "Canon EOS R50", brandName: "Canon", category: "camera", productImage: ["/images/products/camera/Canon EOS R50.jpg"], description: "24.2MP APS-C, 4K video, Dual Pixel CMOS AF, Compact", price: 74995, sellingPrice: 64995 },
    { productName: "Sony ZV-E10 II", brandName: "Sony", category: "camera", productImage: ["/images/products/camera/Sony ZV-E10 II.jpg"], description: "26MP APS-C, 4K 60p, Real-time Eye AF, Vlog-friendly", price: 79990, sellingPrice: 69990 },
    { productName: "Nikon Z30", brandName: "Nikon", category: "camera", productImage: ["/images/products/camera/Nikon Z30.jpg"], description: "20.9MP APS-C, 4K UHD, Vlog-focused, Flip screen", price: 69995, sellingPrice: 59995 },
    { productName: "Fujifilm Instax Mini 12", brandName: "Fujifilm", category: "camera", productImage: ["/images/products/camera/Fujifilm Instax Mini 12.jpg"], description: "Instant film camera, Auto exposure, Close-up mode", price: 7999, sellingPrice: 6499 },

    // ==================== EARPHONES (10) ====================
    { productName: "Sony WH-1000XM5", brandName: "Sony", category: "earphones", productImage: ["/images/products/earphones/Sony WH-1000XM5.jpg"], description: "Industry-leading ANC, 30 hours battery, LDAC, Multipoint", price: 29990, sellingPrice: 24990 },
    { productName: "boAt Bassheads 242", brandName: "boAt", category: "earphones", productImage: ["/images/products/earphones/boAt Bassheads 242.jpg"], description: "10mm driver, Extra bass, In-line mic, 1.2m tangle-free cable", price: 599, sellingPrice: 299 },
    { productName: "JBL Tune 770NC", brandName: "JBL", category: "earphones", productImage: ["/images/products/earphones/JBL Tune 770NC.jpg"], description: "Adaptive ANC, 70 hours battery, JBL Pure Bass, Foldable", price: 7999, sellingPrice: 5999 },
    { productName: "Sennheiser HD 450BT", brandName: "Sennheiser", category: "earphones", productImage: ["/images/products/earphones/Sennheiser HD 450BT.jpg"], description: "ANC, 30 hours battery, aptX, USB-C charging", price: 9990, sellingPrice: 7990 },
    { productName: "Bose QuietComfort 45", brandName: "Bose", category: "earphones", productImage: ["/images/products/earphones/Bose QuietComfort 45.jpg"], description: "World-class ANC, 24 hours battery, Quiet & Aware modes", price: 29900, sellingPrice: 24900 },
    { productName: "Sony MDR-EX150AP", brandName: "Sony", category: "earphones", productImage: ["/images/products/earphones/Sony MDR-EX150AP.jpg"], description: "9mm driver, In-line mic, Tangle-free cable, 3.5mm", price: 1299, sellingPrice: 799 },
    { productName: "boAt Rockerz 450 Pro", brandName: "boAt", category: "earphones", productImage: ["/images/products/earphones/boAt Rockerz 450 Pro.jpg"], description: "40mm driver, 70 hours battery, ASAP charge, ENx tech", price: 2999, sellingPrice: 1299 },
    { productName: "Realme Buds Wireless 3", brandName: "Realme", category: "earphones", productImage: ["/images/products/earphones/Realme Buds Wireless 3.jpg"], description: "13.6mm bass driver, ANC, 40 hours total, Fast charge", price: 2999, sellingPrice: 1999 },
    { productName: "Apple EarPods with Lightning", brandName: "Apple", category: "earphones", productImage: ["/images/products/earphones/Apple EarPods with Lightning.jpg"], description: "Lightning connector, Remote & mic, Ergonomic design", price: 1900, sellingPrice: 1600 },
    { productName: "Noise Tune Elite", brandName: "Noise", category: "earphones", productImage: ["/images/products/earphones/Noise Tune Elite.jpg"], description: "10mm driver, 30 hours total, Neckband, Fast charge, BT 5.3", price: 1999, sellingPrice: 999 },

    // ==================== SPEAKERS (10) ====================
    { productName: "JBL Xtreme 3", brandName: "JBL", category: "speakers", productImage: ["/images/products/speakers/JBL Xtreme 3.jpg"], description: "Powerful JBL Pro Sound, IP67, 15 hours, Powerbank, PartyBoost", price: 19999, sellingPrice: 15999 },
    { productName: "Sony SRS-XB43", brandName: "Sony", category: "speakers", productImage: ["/images/products/speakers/Sony SRS-XB43.jpg"], description: "Extra Bass, IP67, 24 hours, Party Connect 100 speakers", price: 14990, sellingPrice: 11990 },
    { productName: "boAt Stone 1200F", brandName: "boAt", category: "speakers", productImage: ["/images/products/speakers/boAt Stone 1200F.jpg"], description: "14W, IPX7, 13 hours, TWS, RGB lighting, Type-C charging", price: 3990, sellingPrice: 1999 },
    { productName: "Bose SoundLink Max", brandName: "Bose", category: "speakers", productImage: ["/images/products/speakers/Bose SoundLink Max.jpg"], description: "IP67, 20 hours, USB-C, PartyMode, Bose signature sound", price: 39900, sellingPrice: 34900 },
    { productName: "Marshall Emberton II", brandName: "Marshall", category: "speakers", productImage: ["/images/products/speakers/Marshall Emberton II.jpg"], description: "20W, IP67, 30 hours, True Stereophonic, Wireless Stereo pairing", price: 14999, sellingPrice: 12499 },
    { productName: "Harman Kardon Onyx Studio 8", brandName: "Harman Kardon", category: "speakers", productImage: ["/images/products/speakers/Harman Kardon Onyx Studio 8.jpg"], description: "50W, Elegant design, 8 hours, Wireless Dual Sound", price: 24999, sellingPrice: 20999 },
    { productName: "Sonos Era 100", brandName: "Sonos", category: "speakers", productImage: ["/images/products/speakers/Sonos Era 100.webp"], description: "Stereo sound, Wi-Fi + Bluetooth, Trueplay tuning, AirPlay 2", price: 29999, sellingPrice: 25999 },
    { productName: "Amazon Echo Studio", brandName: "Amazon", category: "speakers", productImage: ["/images/products/speakers/Amazon Echo Studio.jpg"], description: "330W, Dolby Atmos, 3D Audio, Alexa built-in, Smart home hub", price: 22999, sellingPrice: 18999 },
    { productName: "JBL Flip 6", brandName: "JBL", category: "speakers", productImage: ["/images/products/speakers/JBL Flip 6.jpg"], description: "20W, IP67, 12 hours, PartyBoost, USB-C", price: 11999, sellingPrice: 9499 },
    { productName: "Anker Soundcore Motion X600", brandName: "Anker", category: "speakers", productImage: ["/images/products/speakers/Anker Soundcore Motion X600.jpg"], description: "50W, Spatial Audio, IPX7, 12 hours, BassUp, USB-C", price: 9999, sellingPrice: 7999 },

    // ==================== REFRIGERATOR (10) ====================
    { productName: "Samsung 653L Side-by-Side Refrigerator", brandName: "Samsung", category: "refrigerator", productImage: ["/images/products/Refrigerator/Godrej 180L Single Door Refrigerator.webp"], description: "Side-by-side, SpaceMax, Twin Cooling Plus, Digital Inverter, No Frost", price: 134900, sellingPrice: 109900 },
    { productName: "LG 655L Side-by-Side Refrigerator", brandName: "LG", category: "refrigerator", productImage: ["/images/products/Refrigerator/LG 655L Side-by-Side Refrigerato.avif"], description: "InstaView Door-in-Door, Linear Cooling, Smart Diagnosis, Wi-Fi", price: 149900, sellingPrice: 124900 },
    { productName: "Whirlpool 340L Frost Free Double Door", brandName: "Whirlpool", category: "refrigerator", productImage: ["/images/products/Refrigerator/Whirlpool 340L Frost Free Double Door.webp"], description: "6th Sense Technology, IntelliSense Inverter, Adaptive Intelligence", price: 42990, sellingPrice: 35990 },
    { productName: "Haier 258L Triple Door Refrigerator", brandName: "Haier", category: "refrigerator", productImage: ["/images/products/Refrigerator/H.webp"], description: "Triple door, Twin Inverter Technology, Convertible, Moisture Fresh Zone", price: 35990, sellingPrice: 28990 },
    { productName: "Samsung 301L Double Door Refrigerator", brandName: "Samsung", category: "refrigerator", productImage: ["/images/products/Refrigerator/Samsung 301L Double Door Refrigerator.jpg"], description: "Convertible 5-in-1, SpaceMax, Digital Inverter, No Frost", price: 35990, sellingPrice: 28990 },
    { productName: "LG 260L Single Door Refrigerator", brandName: "LG", category: "refrigerator", productImage: ["/images/products/Refrigerator/LG 260L Single Door Refrigerator.jpg"], description: "Smart Inverter, Moist Balance Crisper, Auto Smart Connect, 5 Star", price: 26990, sellingPrice: 21990 },
    { productName: "Godrej 180L Single Door Refrigerator", brandName: "Godrej", category: "refrigerator", productImage: ["/images/products/Refrigerator/Godrej 180L Single Door Refrigerator.webp"], description: "Direct Cool, Jumbo Vegetable Tray, Turbo Cooling, 5 Star", price: 16990, sellingPrice: 13990 },
    { productName: "Panasonic 338L Double Door", brandName: "Panasonic", category: "refrigerator", productImage: ["/images/products/Refrigerator/Panasonic 338L Double Door.webp"], description: "Frost Free, Econavi, Prime Fresh Zone, Inverter Compressor", price: 39990, sellingPrice: 32990 },
    { productName: "Bosch 364L Double Door Refrigerator", brandName: "Bosch", category: "refrigerator", productImage: ["/images/products/Refrigerator/Bauch.png"], description: "No Frost, VitaFresh, LED lighting, Super Cooling, Inverter Compressor", price: 54990, sellingPrice: 44990 },
    { productName: "Voltas Beko 185L Single Door", brandName: "Voltas Beko", category: "refrigerator", productImage: ["/images/products/Refrigerator/Voltas Beko 185L Single Door.jpg"], description: "Direct Cool, NeoFrost, HarvestFresh, 5 Star, Anti-bacterial gasket", price: 17990, sellingPrice: 14990 },

    // ==================== TRIMMERS (10) ====================
    { productName: "Philips Series 9000 Trimmer", brandName: "Philips", category: "trimmers", productImage: ["/images/products/trimmers/Philips Series 9000 Trimmer.jpg"], description: "Laser guide, Lift & Trim, 120 min runtime, USB-C, 20 length settings", price: 5995, sellingPrice: 4995 },
    { productName: "Braun Series 7 Electric Shaver", brandName: "Braun", category: "trimmers", productImage: ["/images/products/trimmers/Braun Series 7 Electric Shaver.jpg"], description: "7-in-1 AutoSense, Wet & Dry, 60 min runtime, Clean & Charge station", price: 14999, sellingPrice: 11999 },
    { productName: "Mi Beard Trimmer 1C", brandName: "Mi", category: "trimmers", productImage: ["/images/products/trimmers/Mi Beard Trimmer 1C.jpg"], description: "90 min runtime, 40 length settings, USB Type-C, IPX7", price: 1299, sellingPrice: 899 },
    { productName: "Panasonic ER-GB80 Beard Trimmer", brandName: "Panasonic", category: "trimmers", productImage: ["/images/products/trimmers/Panasonic ER-GB80 Beard Trimmer.jpg"], description: "39 length settings, 50 min runtime, Wet & Dry, Washable", price: 3999, sellingPrice: 2999 },
    { productName: "Wahl Lithium Ion Beard Trimmer", brandName: "Wahl", category: "trimmers", productImage: ["/images/products/trimmers/Wahl Lithium Ion Beard Trimmer.jpg"], description: "4 hours runtime, 12 guide combs, Self-sharpening blades", price: 2495, sellingPrice: 1995 },
    { productName: "boAt Shave Uncut Pro", brandName: "boAt", category: "trimmers", productImage: ["/images/products/trimmers/boAt Shave Uncut Pro.jpg"], description: "75 min runtime, 20 length settings, Type-C, IPX6, Turbo mode", price: 2499, sellingPrice: 1299 },
    { productName: "Havells Trim and Style BT6152C", brandName: "Havells", category: "trimmers", productImage: ["/images/products/trimmers/Havells Trim and Style BT6152C.jpg"], description: "60 min runtime, 20 settings, USB, Cordless & Corded", price: 1499, sellingPrice: 999 },
    { productName: "Gillette Styler 3-in-1", brandName: "Gillette", category: "trimmers", productImage: ["/images/products/trimmers/Gillette Styler 3-in-1.jpg"], description: "Trim, Shave & Edge, Waterproof, 3 combs included", price: 1499, sellingPrice: 999 },
    { productName: "Remington MB4045 Trimmer", brandName: "Remington", category: "trimmers", productImage: ["/images/products/trimmers/Remington MB4045 Trimme.jpg"], description: "70 min runtime, 9 attachments, Titanium blades, USB", price: 3499, sellingPrice: 2499 },
    { productName: "Philips BT3231/15 Beard Trimmer", brandName: "Philips", category: "trimmers", productImage: ["/images/products/trimmers/Philips BT3Beard Trimmer.jpg"], description: "60 min runtime, DuraPower, 20 length settings, Self-sharpening blades", price: 1495, sellingPrice: 1095 },
];

async function seedProducts() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Cartify";
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        await productModel.deleteMany({});
        console.log('🗑️  Cleared existing products\n');

        const result = await productModel.insertMany(rawProducts);
        console.log(`\n✅ Successfully inserted ${result.length} products!\n`);

        const categories = [...new Set(rawProducts.map(p => p.category))];
        console.log('📊 Products added by category:');
        for (const category of categories) {
            const count = rawProducts.filter(p => p.category === category).length;
            console.log(`   - ${category}: ${count} products`);
        }

        console.log('\n🎉 Done!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit();
    }
}

seedProducts();