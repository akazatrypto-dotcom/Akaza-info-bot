// دالة لفتح التطبيق في تلجرام
function openInTelegram() {
    const botUsername = 'Akaza Info Bot'; // ضع اسم بوتك هنا
    const appUrl = window.location.href;
    const telegramUrl = `https://t.me/${botUsername}?startapp=${btoa(appUrl)}`;
    window.open(telegramUrl, '_blank');
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const errorScreen = document.getElementById('errorScreen');
    const loadingScreen = document.getElementById('loadingScreen');
    const profileCard = document.getElementById('profileCard');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // تحقق إذا كان المستخدم في تلجرام
    if (window.Telegram && Telegram.WebApp) {
        // المستخدم داخل تلجرام
        initTelegramApp();
    } else {
        // المستخدم ليس داخل تلجرام
        showErrorScreen();
    }
    
    // تهيئة تطبيق تلجرام
    function initTelegramApp() {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // إظهار شاشة التحميل
        loadingScreen.style.display = 'flex';
        
        // الحصول على بيانات المستخدم
        const user = Telegram.WebApp.initDataUnsafe.user;
        
        if (user) {
            // عرض بيانات المستخدم بعد تأخير قصير
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                displayUserInfo(user);
            }, 1000);
        } else {
            // إذا لم توجد بيانات
            showErrorScreen();
        }
        
        // تخصيص التطبيق
        Telegram.WebApp.setHeaderColor('#0088cc');
        Telegram.WebApp.setBackgroundColor('#f5f7fa');
        
        // إضافة زر الرجوع
        Telegram.WebApp.BackButton.show();
        Telegram.WebApp.BackButton.onClick(() => {
            Telegram.WebApp.close();
        });
    }
    
    // عرض معلومات المستخدم
    function displayUserInfo(user) {
        // 1. الاسم الكامل
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        document.getElementById('userFullName').textContent = fullName || 'بدون اسم';
        
        // 2. اسم المستخدم
        const username = user.username ? `@${user.username}` : 'بدون اسم مستخدم';
        document.getElementById('userName').textContent = username;
        
        // 3. ID المستخدم
        document.getElementById('userId').textContent = user.id;
        
        // 4. اسم المستخدم في القسم
        document.getElementById('username').textContent = username;
        
        // 5. صورة الملف الشخصي
        if (user.photo_url) {
            const avatarImg = document.getElementById('userAvatar');
            avatarImg.src = user.photo_url;
            avatarImg.style.display = 'block';
            document.getElementById('defaultAvatar').style.display = 'none';
            
            // إذا فشل تحميل الصورة
            avatarImg.onerror = function() {
                this.style.display = 'none';
                showDefaultAvatar(fullName);
            };
        } else {
            showDefaultAvatar(fullName);
        }
        
        // 6. اللغة
        const languageNames = {
            'ar': 'العربية 🇸🇦',
            'en': 'English 🇺🇸',
            'ru': 'Русский 🇷🇺',
            'es': 'Español 🇪🇸',
            'fr': 'Français 🇫🇷',
            'de': 'Deutsch 🇩🇪',
            'fa': 'فارسی 🇮🇷',
            'tr': 'Türkçe 🇹🇷'
        };
        
        const userLang = user.language_code || 'en';
        document.getElementById('language').textContent = 
            languageNames[userLang] || userLang.toUpperCase();
        
        // 7. هل هو بوت؟
        document.getElementById('isBot').textContent = user.is_bot ? 'نعم 🤖' : 'لا 👤';
        
        // 8. تقدير تاريخ الإنشاء (بناءً على ID)
        const createdDate = estimateCreationDate(user.id);
        document.getElementById('createdDate').textContent = createdDate;
        
        // 9. حالة البرايميوم (محاكاة - ليس متاحاً مباشرة)
        const isPremium = user.id % 7 === 0; // 14% فرصة
        const accountTypeElement = document.getElementById('accountType');
        const premiumBadge = document.getElementById('premiumBadge');
        
        if (isPremium) {
            accountTypeElement.textContent = 'بريميوم ⭐';
            accountTypeElement.className = 'badge premium';
            premiumBadge.style.display = 'block';
        } else {
            accountTypeElement.textContent = 'عادي';
            accountTypeElement.className = 'badge regular';
            premiumBadge.style.display = 'none';
        }
        
        // إظهار البطاقة
        profileCard.classList.add('active');
    }
    
    // عرض الصورة الافتراضية
    function showDefaultAvatar(fullName) {
        const defaultAvatar = document.getElementById('defaultAvatar');
        
        if (fullName && fullName !== 'بدون اسم') {
            // أخذ الأحرف الأولى
            const initials = fullName
                .split(' ')
                .map(word => word.charAt(0))
                .join('')
                .toUpperCase()
                .substring(0, 2);
            
            defaultAvatar.innerHTML = `<span style="font-size: 32px; font-weight: bold;">${initials}</span>`;
        } else {
            defaultAvatar.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        defaultAvatar.style.display = 'flex';
    }
    
    // تقدير تاريخ الإنشاء
    function estimateCreationDate(userId) {
        const idNumber = parseInt(userId);
        const now = new Date();
        
        // تقدير بناءً على الـ ID
        if (idNumber < 1000000) {
            // حسابات قديمة جداً
            return '2013 - 2014';
        } else if (idNumber < 10000000) {
            return '2015 - 2017';
        } else if (idNumber < 100000000) {
            return '2018 - 2020';
        } else if (idNumber < 1000000000) {
            return '2021 - 2022';
        } else {
            return '2023 - الآن';
        }
    }
    
    // إظهار شاشة الخطأ
    function showErrorScreen() {
        loadingScreen.style.display = 'none';
        errorScreen.classList.add('active');
    }
    
    // حدث زر التحديث
    refreshBtn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديث...';
        this.disabled = true;
        
        setTimeout(() => {
            const user = Telegram.WebApp.initDataUnsafe.user;
            if (user) {
                displayUserInfo(user);
            }
            
            this.innerHTML = '<i class="fas fa-sync-alt"></i> تحديث المعلومات';
            this.disabled = false;
            
            // تأثير نجاح
            this.style.backgroundColor = 'var(--success)';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 500);
        }, 1500);
    });
    
    // إضافة تأثيرات تفاعلية
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // نسخ النص عند النقر
            const text = this.querySelector('.info-value').textContent;
            if (text && text !== 'غير معروف') {
                navigator.clipboard.writeText(text).then(() => {
                    const originalBg = this.style.backgroundColor;
                    this.style.backgroundColor = 'var(--primary)';
                    this.style.color = 'white';
                    
                    setTimeout(() => {
                        this.style.backgroundColor = originalBg;
                        this.style.color = '';
                    }, 500);
                });
            }
        });
    });
});