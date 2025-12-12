import {
    FaHome, FaBed, FaCalendarAlt, FaUserFriends, FaClipboardList,
    FaUtensils, FaCalculator, FaBox, FaTools, FaCheckDouble,
    FaDumbbell, FaStar, FaUserTie, FaGlobe, FaCogs, FaMoon,
    FaFileContract, FaBullhorn, FaMoneyBillWave, FaChartPie, FaChartBar, FaTh,
    FaUniversity, FaCopyright, FaCamera, FaIdCard, FaEnvelope, FaCommentDots,
    FaClock, FaPlane, FaPlaneDeparture, FaUserPlus, FaShieldAlt, FaEyeSlash,
    FaTimesCircle, FaSortAlphaDown, FaPhone, FaExchangeAlt, FaListAlt,
    FaCheckSquare, FaCalendarPlus, FaMobileAlt, FaFileExport, FaSearch,
    FaDesktop, FaMoneyBillAlt, FaFileInvoice, FaChartLine, FaCreditCard,
    FaCalendarCheck, FaKeyboard, FaShoppingBasket, FaWallet,
    FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle,
    FaHeart, FaComments, FaTasks, FaUmbrellaBeach, FaBus, FaPoll, FaStore,
    FaFolder, FaLayerGroup, FaFont, FaPlusCircle, FaCode, FaUserCog, FaWalking,
    FaHamburger, FaBookOpen, FaBookmark, FaSync, FaFileAlt, FaBars, FaBuilding, FaTags
} from "react-icons/fa";

export interface MenuItem {
    title: string;
    icon?: React.ElementType;
    href?: string;
    items?: MenuItem[];
}

// Reusable Sub-sections

const reservationItems: MenuItem[] = [
    { title: "Bekleyen Listesi", icon: FaClock, href: "/dashboard/front-office/pending" },
    { title: "Rezervasyon Listesi", icon: FaPlane, href: "/dashboard/front-office/reservations" },
    { title: "Konaklayan Listesi", icon: FaUserFriends, href: "/dashboard/front-office/guests" },
    { title: "Grup Rezervasyon", icon: FaUserPlus, href: "/dashboard/front-office/groups" },
    { title: "Ayrılanlar Listesi", icon: FaPlaneDeparture, href: "/dashboard/front-office/checkout" },
    { title: "Misafir İsim Listesi", icon: FaUserFriends, href: "/dashboard/front-office/guest-names" },
    { title: "KBS Listesi", icon: FaShieldAlt, href: "/dashboard/reports/kbs" },
    { title: "NoShow Listesi", icon: FaEyeSlash, href: "/dashboard/front-office/noshow" },
    { title: "İptal Listesi", icon: FaTimesCircle, href: "/dashboard/front-office/cancelled" },
    { title: "Hepsi", icon: FaSortAlphaDown, href: "/dashboard/front-office/all" },
    { title: "Rezervasyon Konfirme Listesi", icon: FaCheckDouble, href: "/dashboard/front-office/confirmed" },
    { title: "Rezervasyon Notları Listesi", icon: FaCommentDots, href: "/dashboard/front-office/notes" },
    { title: "Ödeme Tipine Göre Listele", icon: FaListAlt, href: "/dashboard/front-office/payments" },
    { title: "Çağrı Listesi", icon: FaPhone, href: "/dashboard/front-office/calls" },
    { title: "Fiyat ve Doluluk", icon: FaCalendarAlt, href: "/dashboard/settings/price-occupancy" },
    { title: "Tur Operatörü Entegrasyonu", icon: FaExchangeAlt, href: "/dashboard/front-office/tour-ops" },
    { title: "Durum", icon: FaChartPie, href: "/dashboard/reports/status" },
];

const receptionItems: MenuItem[] = [
    { title: "Bekleyen Listesi", icon: FaClock, href: "/dashboard/front-office/pending" },
    { title: "Rezervasyon Listesi", icon: FaPlane, href: "/dashboard/front-office/reservations" },
    { title: "Konaklayan Listesi", icon: FaUserFriends, href: "/dashboard/front-office/guests" },
    { title: "Ayrılanlar Listesi", icon: FaPlaneDeparture, href: "/dashboard/front-office/checkout" },
    { title: "Hepsi", icon: FaSortAlphaDown, href: "/dashboard/front-office/all" },
    { title: "Misafir Kartları", icon: FaIdCard, href: "/dashboard/front-office/guest-cards" },
    { title: "Blokaj", icon: FaCheckDouble, href: "/dashboard/room-plan/blockage" },
    { title: "Room Rack", icon: FaTh, href: "/dashboard/room-plan" },
    { title: "Boş Odalar", icon: FaBed, href: "/dashboard/front-office/vacant-rooms" },
    { title: "Oda Tipi Müsaitlik", icon: FaCheckSquare, href: "/dashboard/front-office/room-type-availability" },
    { title: "Oda Değişim Listesi", icon: FaExchangeAlt, href: "/dashboard/front-office/room-changes" },
    { title: "Planlanan Oda Değişimleri", icon: FaCalendarPlus, href: "/dashboard/front-office/planned-room-changes" },
    { title: "Rezervasyon Notları", icon: FaCommentDots, href: "/dashboard/front-office/reservation-notes" },
    { title: "Görev Notları", icon: FaClipboardList, href: "/dashboard/tasks/notes" },
    { title: "Görev Yönetimi", icon: FaClipboardList, href: "/dashboard/tasks" },
    { title: "Görev Yönetimi Cihaz Tanımları", icon: FaMobileAlt, href: "/dashboard/tasks/devices" },
    { title: "Transfer Edilen Folyo İşlemleri", icon: FaFileExport, href: "/dashboard/accounting/transferred-folios" },
    { title: "Hızlı İşlem", icon: FaTools, href: "/dashboard/operations/quick" },
    { title: "Kayıp Bulunan Listesi", icon: FaSearch, href: "/dashboard/housekeeping/lost-found" },
];

const housekeepingItems: MenuItem[] = [
    { title: "HK Oda İşlemleri", icon: FaMapMarkerAlt, href: "/dashboard/housekeeping/room-operations" },
    { title: "HK Oda Kontrolü", icon: FaCheckCircle, href: "/dashboard/housekeeping/room-check" },
    { title: "HK Kontrol Arşivi", icon: FaCheckCircle, href: "/dashboard/housekeeping/check-archive" },
    { title: "HK Oda Listesi", icon: FaCheckDouble, href: "/dashboard/housekeeping/room-list" },
    { title: "Maid Yönetimi", icon: FaClipboardList, href: "/dashboard/housekeeping/maid-management" },
    { title: "HK Rezervasyon Notları", icon: FaCommentDots, href: "/dashboard/housekeeping/reservation-notes" },
    { title: "Kapalı Oda Listesi", icon: FaExclamationTriangle, href: "/dashboard/housekeeping/closed-rooms" },
    { title: "Blokaj", icon: FaCalendarAlt, href: "/dashboard/room-plan/blockage" },
    { title: "Room Rack", icon: FaTh, href: "/dashboard/room-plan" },
    { title: "Kayıp Bulunan Listesi", icon: FaSearch, href: "/dashboard/housekeeping/lost-found" },
    { title: "Oda Değişimi", icon: FaExchangeAlt, href: "/dashboard/housekeeping/room-change" },
    { title: "Planlanan Oda Değişimleri", icon: FaCalendarPlus, href: "/dashboard/front-office/planned-room-changes" },
    { title: "Rezervasyon Listesi", icon: FaPlane, href: "/dashboard/front-office/reservations" },
    { title: "Görev Yönetimi HK", icon: FaExclamationTriangle, href: "/dashboard/housekeeping/tasks-hk" },
    { title: "Durum", icon: FaChartPie, href: "/dashboard/reports/status" },
];



const cashierItems: MenuItem[] = [
    { title: "Ön Kasa", icon: FaMoneyBillAlt, href: "/dashboard/accounting/cashier" },
    { title: "Kasa İşlemleri", icon: FaDesktop, href: "/dashboard/accounting/cash-operations" },
    { title: "Folyo İşlemleri", icon: FaFileContract, href: "/dashboard/accounting/folio-operations" },
    { title: "Döviz Bozdurma İşlemleri", icon: FaMoneyBillWave, href: "/dashboard/accounting/exchange" },
    { title: "Fatura Listesi", icon: FaFileInvoice, href: "/dashboard/accounting/invoices" },
    { title: "Harcama İşlemi", icon: FaChartLine, href: "/dashboard/accounting/expenses" },
    { title: "Gider Kodları", icon: FaCogs, href: "/dashboard/accounting/expense-codes" },
    { title: "Günlük Döviz Kurları", icon: FaCalendarCheck, href: "/dashboard/accounting/daily-rates" },
    { title: "Günlük Kur Girişi", icon: FaKeyboard, href: "/dashboard/accounting/rate-entry" },
    { title: "Kredi Kartı İşlemleri", icon: FaCreditCard, href: "/dashboard/accounting/credit-card" },
    { title: "Web Sitesi Basketleri", icon: FaShoppingBasket, href: "/dashboard/accounting/web-baskets" },
    { title: "Depozit İşlemleri", icon: FaWallet, href: "/dashboard/accounting/deposits" },
];

const posItems: MenuItem[] = [
    { title: "POS Terminali", href: "/dashboard/pos" },
    { title: "Masa Planı", href: "/dashboard/pos/tables" },
    { title: "Menü Yönetimi", href: "/dashboard/pos/menu" },
    { title: "Adisyonlar", href: "/dashboard/pos/orders" },
];

const fbItems: MenuItem[] = [
    { title: "Restoran Kontrol Listesi", icon: FaUtensils, href: "/dashboard/pos/restaurant-checklist" },
    { title: "Misafirler için Yemek Planı", icon: FaHamburger, href: "/dashboard/pos/meal-plan" },
    { title: "Görev Yönetimi FB", icon: FaExclamationTriangle, href: "/dashboard/pos/tasks-fb" },
    { title: "Pansiyon Forecast", icon: FaBookOpen, href: "/dashboard/pos/pension-forecast" },
];

const salesItems: MenuItem[] = [
    { title: "Acenta Grup Tanımları", icon: FaLayerGroup, href: "/dashboard/contract/agency-groups" },
    { title: "Acentalar", icon: FaFont, href: "/dashboard/contract/agencies" },
    { title: "Fiyat ve Doluluk", icon: FaCalendarAlt, href: "/dashboard/contract/price-occupancy" },
    { title: "Fiyat ve Doluluk Listesi", icon: FaCalendarCheck, href: "/dashboard/contract/price-occupancy-list" },
    { title: "Kontrat Sihirbazı", icon: FaPlusCircle, href: "/dashboard/contract/wizard" },
    { title: "Kontrat ve Fiyat Kodları", icon: FaCheckSquare, href: "/dashboard/contract/codes" },
    { title: "Fiyat Kodu Grupları", icon: FaCheckSquare, href: "/dashboard/contract/code-groups" },
    { title: "Kontrat Detayları", icon: FaListAlt, href: "/dashboard/contract/details" },
    { title: "Kontrat İndirim ve Eklentileri", icon: FaChartLine, href: "/dashboard/contract/discounts" },
    { title: "Promosyonlar", icon: FaFolder, href: "/dashboard/contract/promotions" },
    { title: "Stop Sale", icon: FaTimesCircle, href: "/dashboard/contract/stop-sale" },
    { title: "Kaynak Kodları", icon: FaCode, href: "/dashboard/contract/source-codes" },
    { title: "Marketler", icon: FaStore, href: "/dashboard/contract/markets" },
];

const accountingItems: MenuItem[] = [
    { title: "Fatura", icon: FaFileInvoice, href: "/dashboard/accounting/invoices" },
    { title: "Hesap Kartları", icon: FaIdCard, href: "/dashboard/accounting/accounts" },
    { title: "Kontrol Listesi", icon: FaClipboardList, href: "/dashboard/accounting/checklist" },
    { title: "Muhasebe Entegrasyonu", icon: FaFolder, href: "/dashboard/accounting/integration" },
    { title: "Bütçe Yönetimi", icon: FaChartBar, href: "/dashboard/accounting/budget" },
];

const reportItems: MenuItem[] = [
    { title: "Günlük Raporlar", icon: FaBookmark, href: "/dashboard/reports/daily" },
    { title: "Rezervasyon Raporları", icon: FaBookmark, href: "/dashboard/reports/reservations" },
    { title: "Küp Analizleri", icon: FaBookmark, href: "/dashboard/reports/cube-analysis" },
    { title: "Gelir Raporları", icon: FaBookmark, href: "/dashboard/reports/revenue" },
    { title: "CRM Raporları", icon: FaBookmark, href: "/dashboard/reports/crm" },
    { title: "Santral Raporları", icon: FaBookmark, href: "/dashboard/reports/switchboard" },
    { title: "Günlük Kontrol Raporları", icon: FaBookmark, href: "/dashboard/reports/daily-check" },
    { title: "Kapı Kilit", icon: FaBookmark, href: "/dashboard/reports/door-lock" },
    { title: "Dijital İmza", icon: FaBookmark, href: "/dashboard/reports/digital-signature" },
    { title: "Muhasebe Raporları", icon: FaBookmark, href: "/dashboard/reports/accounting" },
    { title: "Forecast Raporları", icon: FaFolder, href: "/dashboard/reports/forecast" },
    { title: "Yedekleme Raporları", icon: FaBookmark, href: "/dashboard/reports/backup" },
    { title: "Kat Hizmetleri Raporları", icon: FaBookmark, href: "/dashboard/reports/housekeeping" },
    { title: "Yönetim Raporları", icon: FaBars, href: "/dashboard/reports/management" },
    { title: "Bakım Ekranı", icon: FaSync, href: "/dashboard/reports/maintenance" },
    { title: "API Raporları", icon: FaFileAlt, href: "/dashboard/reports/api" },
];

const settingsItems: MenuItem[] = [
    { title: "Otel Bilgileri", icon: FaUniversity, href: "/dashboard/settings/hotel-info" },
    { title: "Varsayılan Otel Ayarları", icon: FaCogs, href: "/dashboard/settings/defaults" },
    { title: "Kuruluş Menüsü", icon: FaCogs, href: "/dashboard/settings/setup" },
    { title: "Fiyat ve Doluluk", icon: FaCalendarAlt, href: "/dashboard/settings/price-occupancy" },
    {
        title: "Standart Fiyatlar",
        icon: FaCopyright,
        items: [
            { title: "Standart Fiyat Listesi", href: "/dashboard/settings/prices/standard" },
            { title: "Fiyat Aksiyonları", href: "/dashboard/settings/prices/actions" },
            { title: "Fiyat Değişiklik Logu", href: "/dashboard/settings/prices/logs" }
        ]
    },
    { title: "Online Rezervasyon Ayarları", icon: FaCogs, href: "/dashboard/settings/online-booking" },
    { title: "Oda Tipi Fotoğrafları", icon: FaCamera, href: "/dashboard/settings/photos" },
    { title: "Yatak Tipleri", icon: FaBed, href: "/dashboard/settings/bed-types" },
    { title: "Oda Tanımları", icon: FaBuilding, href: "/dashboard/settings/rooms" },
    { title: "Gelir Grup Tanımları", icon: FaCalculator, href: "/dashboard/settings/revenue" },
    { title: "Döviz Tanımları", icon: FaMoneyBillWave, href: "/dashboard/settings/currency" },
    { title: "Pansiyon Tipleri", icon: FaUtensils, href: "/dashboard/settings/board-types" },
    { title: "Fiyat Tipleri", icon: FaTags, href: "/dashboard/settings/price-types" },
    { title: "Lisans Bilgisi", icon: FaIdCard, href: "/dashboard/settings/license" },
    { title: "Otomatik Mail Gönder", icon: FaEnvelope, href: "/dashboard/settings/auto-mail" },
    { title: "Gönderilen SMSler", icon: FaCommentDots, href: "/dashboard/settings/sms-logs" },
    { title: "Gelişmiş Ayarlar", icon: FaCogs, href: "/dashboard/settings/advanced" },
];

const crmItems: MenuItem[] = [
    { title: "Misafir Tipi (VIP)", icon: FaStar, href: "/dashboard/crm/vip-types" },
    { title: "Misafir Kartları", icon: FaIdCard, href: "/dashboard/front-office/guest-cards" },
    { title: "Misafir Listesi", icon: FaUserFriends, href: "/dashboard/front-office/guests" },
    { title: "Rezervasyon Listesi", icon: FaPlane, href: "/dashboard/front-office/reservations" },
    { title: "Restoran Rezervasyon Listesi", icon: FaUtensils, href: "/dashboard/crm/restaurant-reservations" },
    { title: "Günlük Misafir Sağlık Durumları", icon: FaHeart, href: "/dashboard/crm/health" },
    { title: "Planlanan Oda Değişimleri", icon: FaCalendarPlus, href: "/dashboard/front-office/planned-room-changes" },
    { title: "Rezervasyon Notları", icon: FaCommentDots, href: "/dashboard/front-office/notes" },
    { title: "Görev Yönetimi GR", icon: FaExclamationTriangle, href: "/dashboard/crm/tasks-gr" },
    { title: "Misafir Yorumları", icon: FaComments, href: "/dashboard/crm/comments" },
    { title: "Kayıp Bulunan Listesi", icon: FaSearch, href: "/dashboard/housekeeping/lost-found" },
    { title: "Task Opsiyon Tanımları", icon: FaTasks, href: "/dashboard/crm/task-options" },
    { title: "Otel Tesis Rezervasyonları", icon: FaUmbrellaBeach, href: "/dashboard/crm/facility-reservations" },
    { title: "Otel Transfer Listesi", icon: FaBus, href: "/dashboard/crm/transfers" },
    { title: "Anket Menü", icon: FaPoll, href: "/dashboard/crm/surveys" },
];

const nightAuditItems: MenuItem[] = [
    { title: "Gün Sonu", icon: FaMoon, href: "/dashboard/front-office/night-audit" },
    { title: "Eski Gün Sonu Raporları", icon: FaClipboardList, href: "/dashboard/front-office/night-audit/old-reports" },
    { title: "Yıl Sonu İşlemleri", icon: FaCalendarCheck, href: "/dashboard/front-office/night-audit/year-end" },
    { title: "Gün Sonu Log", icon: FaListAlt, href: "/dashboard/front-office/night-audit/logs" },
];

const technicalItems: MenuItem[] = [
    { title: "Görev Yönetimi Teknik", icon: FaExclamationTriangle, href: "/dashboard/technical/tasks" },
    { title: "Blokaj", icon: FaCalendarAlt, href: "/dashboard/room-plan/blockage" },
    { title: "Room Rack", icon: FaTh, href: "/dashboard/room-plan" },
    { title: "Kapalı Oda Listesi", icon: FaExclamationTriangle, href: "/dashboard/housekeeping/closed-rooms" },
    { title: "Lejyonella Kontrol Listesi", icon: FaCheckCircle, href: "/dashboard/technical/legionella" },
    { title: "Rezervasyon Listesi", icon: FaPlane, href: "/dashboard/front-office/reservations" },
    { title: "Görev Yönetimi Analizi", icon: FaChartBar, href: "/dashboard/tasks/analysis" },
];

const securityItems: MenuItem[] = [
    { title: "Rezervasyon Listesi", icon: FaUserFriends, href: "/dashboard/front-office/reservations" },
    { title: "Ziyaretçi Listesi", icon: FaWalking, href: "/dashboard/security/visitors" },
    { title: "Misafir İsim Listesi", icon: FaUserFriends, href: "/dashboard/front-office/guest-names" },
    { title: "Kayıp Bulunan Listesi", icon: FaSearch, href: "/dashboard/housekeeping/lost-found" },
];

// ...

// --- Module Menus ---

export const moduleMenus: Record<string, MenuItem[]> = {
    // 1. Durum (Status)
    'status': [
        { title: "Rezervasyon", icon: FaCalendarAlt, items: reservationItems },
        { title: "Resepsiyon", icon: FaBed, items: receptionItems },
        { title: "Kat Hizmetleri", icon: FaTools, items: housekeepingItems },
        { title: "Teknik Servis", icon: FaTools, items: technicalItems },
        { title: "CRM", icon: FaStar, items: crmItems },
        { title: "Gün Sonu", icon: FaMoon, items: nightAuditItems },
        { title: "Kontrat Yönetimi", icon: FaFileContract, items: salesItems },
        { title: "Muhasebe", icon: FaCalculator, items: accountingItems },
        { title: "Güvenlik Hizmetleri", icon: FaShieldAlt, items: securityItems },
        { title: "Yiyecek ve İçecek", icon: FaUtensils, items: fbItems },
        { title: "Stok & Maliyet", icon: FaBox, items: posItems },
        { title: "Raporlar", icon: FaClipboardList, items: reportItems },
        { title: "Kuruluş", icon: FaCogs, items: settingsItems },
        { title: "Yardım", icon: FaStar, href: "/help" },
        { title: "Kullanıcı Bilgileri", icon: FaUserCog, href: "/dashboard/user-info" },
        { title: "Extranet", icon: FaGlobe, href: "/dashboard/extranet" },
    ],

    // 2. Dağılım (Distribution)
    'distribution': [
        { title: "Kanal Dağılımı", icon: FaGlobe, href: "/dashboard/distribution/channels" },
        { title: "Pazar Dağılımı", icon: FaChartPie, href: "/dashboard/distribution/market" },
        { title: "Coğrafi Dağılım", icon: FaGlobe, href: "/dashboard/distribution/geo" },
    ],

    // 3. Doluluk (Occupancy)
    'occupancy': [
        { title: "Doluluk Analizi", icon: FaChartBar, href: "/dashboard/reports/occupancy" },
        { title: "Forecast", icon: FaCalendarAlt, href: "/dashboard/reports/forecast" },
        { title: "Gelecek Durum", icon: FaChartPie, href: "/dashboard/reports/future" },
    ],

    // 4. Yönetim (Management)
    'management': [
        { title: "Yönetim Raporları", icon: FaClipboardList, href: "/dashboard/reports/management" },
        { title: "Log Kayıtları", icon: FaClipboardList, href: "/dashboard/logs" },
        { title: "Kullanıcılar", icon: FaUserFriends, href: "/dashboard/settings/users" },
    ],

    // 5. Fiyatlar (Rates)
    'rates': [
        { title: "Fiyat Listeleri", icon: FaMoneyBillWave, href: "/dashboard/sales/rates" },
        { title: "Kontratlar", icon: FaFileContract, href: "/dashboard/sales/contracts" },
        { title: "Kampanyalar", icon: FaBullhorn, href: "/dashboard/sales/campaigns" },
        { title: "Verim Yönetimi", icon: FaChartBar, href: "/dashboard/sales/yield" },
    ],

    // 6. Rack (Room Plan)
    'rack': [
        { title: "Rack Görünümü", icon: FaTh, href: "/dashboard/room-plan" },
        { title: "Oda Listesi", icon: FaBed, href: "/dashboard/front-office/rooms" },
        { title: "Blokaj Çizelgesi", icon: FaCalendarAlt, href: "/dashboard/room-plan/blockage" },
    ],

    // 7. Blokaj (Blockage)
    'blockage': [
        { title: "Blokaj İşlemleri", icon: FaCheckDouble, href: "/dashboard/room-plan/blockage" },
        { title: "Grup Rezervasyonları", icon: FaUserFriends, href: "/dashboard/front-office/groups" },
        { title: "Oda Atama", icon: FaBed, href: "/dashboard/front-office/room-assign" },
    ],

    // 8. Rezervasyon (Reservation - MAIN)
    'reservation': [
        { title: "Kuruluş", icon: FaCogs, items: settingsItems },
        { title: "Rezervasyon", icon: FaCalendarAlt, items: reservationItems },
        { title: "Resepsiyon", icon: FaBed, items: receptionItems },
        { title: "Ön Kasa", icon: FaCalculator, href: "/dashboard/accounting" },
        { title: "Kat Hizmetleri", icon: FaTools, items: housekeepingItems },
        { title: "Teknik Servis", icon: FaTools, href: "/dashboard/technical" },
        { title: "CRM", icon: FaStar, href: "/dashboard/crm" },
        { title: "Gün Sonu", icon: FaMoon, href: "/dashboard/front-office/night-audit" },
        { title: "Kontrat Yönetimi", icon: FaFileContract, items: salesItems },
        { title: "Satış Pazarlama", icon: FaBullhorn, href: "/dashboard/sales" },
        { title: "Hesap", icon: FaCalculator, href: "/dashboard/accounting/accounts" },
        { title: "Raporlar", icon: FaClipboardList, items: reportItems },
        { title: "Yardım", icon: FaStar, href: "/help" },
    ],

    // 9. Konaklayan (Staying / In House)
    'staying': [
        { title: "Misafir Listesi", icon: FaUserFriends, href: "/dashboard/front-office/guests" },
        { title: "Polis Raporu (KBS)", icon: FaUserTie, href: "/dashboard/reports/kbs" },
        { title: "Housekeeping", icon: FaTools, items: housekeepingItems },
    ],

    // 10. Önkasa (Cashier)
    'cashier': [
        { title: "Ön Kasa", icon: FaCalculator, items: cashierItems },
        { title: "Folio Yönetimi", icon: FaFileContract, href: "/dashboard/folios" },
        { title: "Döviz Kurları", icon: FaGlobe, href: "/dashboard/accounting/currency" },
    ],

    // 11. Booking (Online)
    'booking': [
        { title: "Kanal Yöneticisi", icon: FaGlobe, href: "/dashboard/channel" },
        { title: "Online Rezervasyon", icon: FaGlobe, href: "/dashboard/online" },
        { title: "Acenteler", icon: FaUserTie, href: "/dashboard/sales/agencies" },
    ],

    // 12. POS
    'pos': [
        { title: "POS Satış", icon: FaUtensils, items: posItems },
        { title: "Stok & Envanter", icon: FaBox, href: "/dashboard/stock" },
        { title: "Reçeteler", icon: FaClipboardList, href: "/dashboard/stock/recipes" },
    ],

    // 13. Hızlı Posting (Quick Posting)
    'quick_posting': [
        { title: "Hızlı Satış", icon: FaUtensils, href: "/dashboard/pos/quick" },
        { title: "Toplu İşlem", icon: FaCheckDouble, href: "/dashboard/operations/batch" },
        { title: "Mini Bar", icon: FaBox, href: "/dashboard/housekeeping/minibar" },
    ],

    // 14. İşler (Tasks)
    'tasks': [
        { title: "Görev Yöneticisi", icon: FaClipboardList, href: "/dashboard/tasks" },
        { title: "Housekeeping", icon: FaTools, href: "/dashboard/housekeeping" },
        { title: "Teknik Servis", icon: FaTools, href: "/dashboard/technical" },
    ]
};

// Default export for backward compatibility
export const menuItems = moduleMenus['reservation'];
