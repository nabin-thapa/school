const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

function writeFile(filepath, content) {
    const fullPath = path.join(baseDir, filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf-8');
}

const HEAD_TEMPLATE = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} | Vidyodaya Shishu Sadan</title>
    <meta name="description" content="{{desc}}">
    <meta property="og:title" content="{{title}} | Vidyodaya Shishu Sadan">
    <meta property="og:description" content="{{desc}}">
    <meta property="og:image" content="/src/assets/images/og-image.jpg">
    <meta property="og:url" content="https://vidyodayaschool.edu.np">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Netlify Identity Widget -->
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
    
    <!-- AOS CSS -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="/src/css/style.css">
</head>
`;

const HEADER = `
    <!-- Loader -->
    <div id="loader">
        <div class="spinner"></div>
    </div>

    <!-- Header & Navbar -->
    <header>
        <!-- Top Bar -->
        <div class="bg-primary-900 text-white text-sm py-2 hidden md:block">
            <div class="container mx-auto px-4 flex justify-between items-center">
                <div class="flex space-x-6">
                    <span class="flex items-center"><i data-lucide="map-pin" class="w-4 h-4 mr-2 text-secondary-500"></i> Gauradaha-1, Jhapa, Nepal</span>
                    <span class="flex items-center"><i data-lucide="phone" class="w-4 h-4 mr-2 text-secondary-500"></i> +977-23-480194</span>
                    <span class="flex items-center"><i data-lucide="mail" class="w-4 h-4 mr-2 text-secondary-500"></i> info@vidyodayaschool.edu.np</span>
                </div>
                <div class="flex space-x-4">
                    <a href="#" class="hover:text-secondary-400 transition"><i data-lucide="facebook" class="w-4 h-4"></i></a>
                    <a href="#" class="hover:text-secondary-400 transition"><i data-lucide="twitter" class="w-4 h-4"></i></a>
                    <a href="#" class="hover:text-secondary-400 transition"><i data-lucide="youtube" class="w-4 h-4"></i></a>
                </div>
            </div>
        </div>

        <!-- Main Navbar -->
        <nav id="navbar" class="fixed w-full z-50 transition-all duration-300 py-4 {{nav_class}}">
            <div class="container mx-auto px-4 flex justify-between items-center">
                <a href="index.html" class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center text-primary-900 font-bold text-xl">V</div>
                    <div>
                        <h1 class="text-xl md:text-2xl font-bold font-heading leading-tight m-0 nav-heading drop-shadow-md">Vidyodaya Shishu Sadan</h1>
                        <p class="text-xs font-medium tracking-wide nav-subtext hidden md:block drop-shadow-md">Gauradaha-1, Jhapa</p>
                    </div>
                </a>

                <!-- Desktop Menu -->
                <div class="hidden lg:flex space-x-8 items-center font-medium">
                    <a href="index.html" class="hover:text-secondary-500 transition nav-link {{active_home}}">Home</a>
                    <a href="about.html" class="hover:text-secondary-500 transition nav-link {{active_about}}">About Us</a>
                    <a href="academics.html" class="hover:text-secondary-500 transition nav-link {{active_academics}}">Academics</a>
                    <a href="facilities.html" class="hover:text-secondary-500 transition nav-link {{active_facilities}}">Facilities</a>
                    <a href="gallery.html" class="hover:text-secondary-500 transition nav-link {{active_gallery}}">Gallery</a>
                    <a href="notices.html" class="hover:text-secondary-500 transition nav-link {{active_notices}}">Notices</a>
                    <a href="contact.html" class="hover:text-secondary-500 transition nav-link {{active_contact}}">Contact</a>
                    <a href="contact.html" class="bg-secondary-500 text-primary-900 px-5 py-2 rounded-full hover:bg-secondary-600 transition font-bold shadow-lg">Admission Open</a>
                </div>

                <!-- Mobile Menu Button -->
                <button id="mobile-menu-btn" class="lg:hidden nav-link focus:outline-none">
                    <i data-lucide="menu" class="w-8 h-8 drop-shadow-md"></i>
                </button>
            </div>
        </nav>

        <!-- Mobile Menu Dropdown -->
        <div id="mobile-menu" class="hidden fixed inset-0 z-40 bg-white pt-24 pb-6 px-6 overflow-y-auto">
            <div class="flex justify-end mb-4">
                <button id="mobile-menu-close" class="text-gray-500 hover:text-primary-600 focus:outline-none">
                    <i data-lucide="x" class="w-8 h-8"></i>
                </button>
            </div>
            <div class="flex flex-col space-y-4 text-lg font-medium text-gray-800">
                <a href="index.html" class="hover:text-primary-600 border-b pb-2 {{active_home_mob}}">Home</a>
                <a href="about.html" class="hover:text-primary-600 border-b pb-2 {{active_about_mob}}">About Us</a>
                <a href="academics.html" class="hover:text-primary-600 border-b pb-2 {{active_academics_mob}}">Academics</a>
                <a href="facilities.html" class="hover:text-primary-600 border-b pb-2 {{active_facilities_mob}}">Facilities</a>
                <a href="gallery.html" class="hover:text-primary-600 border-b pb-2 {{active_gallery_mob}}">Gallery</a>
                <a href="notices.html" class="hover:text-primary-600 border-b pb-2 {{active_notices_mob}}">Notices</a>
                <a href="contact.html" class="hover:text-primary-600 border-b pb-2 {{active_contact_mob}}">Contact</a>
                <a href="contact.html" class="btn-primary text-center mt-4 !w-full">Admission Open</a>
            </div>
        </div>
    </header>
`;

const FOOTER = `
    <!-- Footer -->
    <footer class="bg-primary-900 text-white pt-16 pb-8 border-t-4 border-secondary-500 mt-20">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <!-- About -->
                <div data-aos="fade-up" data-aos-delay="0">
                    <div class="flex items-center space-x-3 mb-6">
                        <div class="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center text-primary-900 font-bold text-xl">V</div>
                        <h2 class="text-xl font-bold font-heading m-0">Vidyodaya Shishu Sadan</h2>
                    </div>
                    <p class="text-blue-100 text-sm leading-relaxed mb-6">Empowering minds and shaping futures in Gauradaha-1, Jhapa. Providing quality education with a blend of modern curriculum and traditional values.</p>
                    <div class="flex space-x-4">
                        <a href="#" class="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-secondary-500 hover:text-primary-900 transition"><i data-lucide="facebook" class="w-5 h-5"></i></a>
                        <a href="#" class="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-secondary-500 hover:text-primary-900 transition"><i data-lucide="twitter" class="w-5 h-5"></i></a>
                        <a href="#" class="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-secondary-500 hover:text-primary-900 transition"><i data-lucide="instagram" class="w-5 h-5"></i></a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div data-aos="fade-up" data-aos-delay="100">
                    <h3 class="text-lg font-bold mb-6 text-secondary-400">Quick Links</h3>
                    <ul class="space-y-3 text-blue-100 text-sm">
                        <li><a href="about.html" class="hover:text-secondary-400 transition flex items-center"><i data-lucide="chevron-right" class="w-4 h-4 mr-2"></i> About Us</a></li>
                        <li><a href="academics.html" class="hover:text-secondary-400 transition flex items-center"><i data-lucide="chevron-right" class="w-4 h-4 mr-2"></i> Academics</a></li>
                        <li><a href="facilities.html" class="hover:text-secondary-400 transition flex items-center"><i data-lucide="chevron-right" class="w-4 h-4 mr-2"></i> Facilities</a></li>
                        <li><a href="gallery.html" class="hover:text-secondary-400 transition flex items-center"><i data-lucide="chevron-right" class="w-4 h-4 mr-2"></i> Gallery</a></li>
                        <li><a href="notices.html" class="hover:text-secondary-400 transition flex items-center"><i data-lucide="chevron-right" class="w-4 h-4 mr-2"></i> Notices</a></li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div data-aos="fade-up" data-aos-delay="200">
                    <h3 class="text-lg font-bold mb-6 text-secondary-400">Contact Us</h3>
                    <ul class="space-y-4 text-blue-100 text-sm">
                        <li class="flex items-start">
                            <i data-lucide="map-pin" class="w-5 h-5 mr-3 text-secondary-500 flex-shrink-0 mt-0.5"></i>
                            <span>Gauradaha-1, Jhapa<br>Koshi Province, Nepal</span>
                        </li>
                        <li class="flex items-center">
                            <i data-lucide="phone" class="w-5 h-5 mr-3 text-secondary-500 flex-shrink-0"></i>
                            <span>+977-23-480194</span>
                        </li>
                        <li class="flex items-center">
                            <i data-lucide="mail" class="w-5 h-5 mr-3 text-secondary-500 flex-shrink-0"></i>
                            <span>info@vidyodayaschool.edu.np</span>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div data-aos="fade-up" data-aos-delay="300">
                    <h3 class="text-lg font-bold mb-6 text-secondary-400">Newsletter</h3>
                    <p class="text-blue-100 text-sm mb-4">Subscribe to our newsletter for the latest updates and notices.</p>
                    <form class="flex flex-col space-y-3">
                        <input type="email" placeholder="Your Email Address" class="px-4 py-3 rounded-lg bg-primary-800 border border-primary-700 text-white placeholder-blue-300 focus:outline-none focus:border-secondary-500 transition">
                        <button type="button" class="btn-secondary w-full text-center">Subscribe</button>
                    </form>
                </div>
            </div>
            
            <div class="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-200">
                <p>&copy; 2026 Vidyodaya Shishu Sadan. All rights reserved.</p>
                <p class="mt-2 md:mt-0">Designed with <i data-lucide="heart" class="w-4 h-4 inline text-red-500 mx-1"></i> in Nepal</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script type="module" src="/src/js/main.js"></script>
</body>
</html>
`;

function generatePage(filename, title, desc, activeNav, content, isHome = false) {
    let navClass = isHome ? "text-white" : "bg-white shadow-md text-gray-800";
    
    let html = '<!DOCTYPE html>\n<html lang="en">\n';
    
    let headStr = HEAD_TEMPLATE.replace("{{title}}", title).replace("{{desc}}", desc);
    html += headStr;
    
    let bodyClass = isHome ? "home-page" : "inner-page";
    html += `<body class="${bodyClass} bg-gray-50">\n`;
    
    let headerStr = HEADER;
    headerStr = headerStr.replace("{{nav_class}}", navClass);
    
    const navs = ["home", "about", "academics", "facilities", "gallery", "notices", "contact"];
    navs.forEach(nav => {
        let deskActive = activeNav === nav ? "active-nav font-bold" : "";
        if (isHome && deskActive) {
            deskActive = "text-secondary-400 font-bold";
        }
        headerStr = headerStr.split(`{{active_${nav}}}`).join(deskActive);
        
        let mobActive = activeNav === nav ? "text-primary-600 font-bold" : "";
        headerStr = headerStr.split(`{{active_${nav}_mob}}`).join(mobActive);
    });
    
    html += headerStr;
    html += content;
    html += FOOTER;
    
    writeFile(filename, html);
}

const HOME_CONTENT = `
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="/src/assets/images/school-photo.jpg" alt="School Campus" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-primary-900/70 mix-blend-multiply"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900/90"></div>
        </div>
        
        <div class="container mx-auto px-4 z-10 text-center text-white pt-20" data-aos="zoom-in" data-aos-duration="1000">
            <span class="inline-block py-1.5 px-4 rounded-full bg-secondary-500/20 border border-secondary-500 text-secondary-400 font-bold text-sm mb-6 uppercase tracking-widest backdrop-blur-sm shadow-lg">Welcome to Excellence</span>
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white drop-shadow-xl">Vidyodaya <br/><span class="text-secondary-400">Shishu Sadan</span></h1>
            <p class="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-50 font-light drop-shadow-md">Empowering minds, shaping futures. A premier educational institution in Gauradaha committed to academic excellence.</p>
            <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <a href="contact.html" class="btn-primary !px-8 !py-4 text-lg !bg-secondary-500 !text-primary-900 hover:!bg-secondary-400 flex items-center justify-center"><i data-lucide="graduation-cap" class="w-5 h-5 mr-2"></i> Admission Open</a>
                <a href="about.html" class="btn-outline !px-8 !py-4 text-lg !border-white !text-white hover:!bg-white hover:!text-primary-900 flex items-center justify-center">Explore School <i data-lucide="arrow-right" class="w-5 h-5 ml-2"></i></a>
            </div>
        </div>
        
        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <a href="#stats" class="text-white opacity-80 hover:opacity-100 transition flex flex-col items-center">
                <span class="text-xs font-medium tracking-widest uppercase mb-2">Scroll</span>
                <i data-lucide="chevron-down" class="w-6 h-6"></i>
            </a>
        </div>
    </section>

    <!-- Stats Section -->
    <section id="stats" class="py-12 bg-white shadow-sm relative z-20 -mt-8 mx-4 md:mx-auto md:w-11/12 lg:w-4/5 rounded-2xl border border-gray-100">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div data-aos="fade-up" data-aos-delay="0">
                    <div class="w-16 h-16 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-600">
                        <i data-lucide="users" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-4xl font-bold text-primary-900 mb-1"><span class="stat-number" data-target="1200">0</span>+</h3>
                    <p class="text-gray-500 font-medium">Students Enrolled</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="100">
                    <div class="w-16 h-16 mx-auto bg-secondary-50 rounded-full flex items-center justify-center mb-4 text-secondary-500">
                        <i data-lucide="book-open" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-4xl font-bold text-primary-900 mb-1"><span class="stat-number" data-target="45">0</span>+</h3>
                    <p class="text-gray-500 font-medium">Expert Teachers</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="200">
                    <div class="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
                        <i data-lucide="award" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-4xl font-bold text-primary-900 mb-1"><span class="stat-number" data-target="15">0</span>+</h3>
                    <p class="text-gray-500 font-medium">Years of Excellence</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="300">
                    <div class="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
                        <i data-lucide="graduation-cap" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-4xl font-bold text-primary-900 mb-1"><span class="stat-number" data-target="100">0</span>%</h3>
                    <p class="text-gray-500 font-medium">Pass Rate</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Principal Message preview -->
    <section class="section-padding bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row items-center gap-12">
                <div class="lg:w-1/2 relative" data-aos="fade-right">
                    <div class="absolute inset-0 bg-secondary-500 rounded-3xl transform translate-x-4 translate-y-4"></div>
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Principal" class="relative z-10 rounded-3xl shadow-xl w-full object-cover h-[500px]">
                    <div class="absolute bottom-10 -right-6 z-20 bg-white p-6 rounded-2xl shadow-xl max-w-xs border-l-4 border-primary-600 hidden md:block">
                        <i data-lucide="quote" class="text-primary-200 w-10 h-10 mb-2"></i>
                        <p class="text-gray-600 italic font-medium">"Education is not preparation for life; education is life itself."</p>
                    </div>
                </div>
                <div class="lg:w-1/2" data-aos="fade-left">
                    <span class="text-secondary-600 font-bold tracking-wider uppercase text-sm">Message from Principal</span>
                    <h2 class="text-4xl md:text-5xl font-bold mt-2 mb-6 text-primary-900">Nurturing the Leaders of Tomorrow</h2>
                    <p class="text-gray-600 text-lg mb-6 leading-relaxed">At Vidyodaya Shishu Sadan, we believe that every child is unique and has the potential to excel. Our dedicated faculty and state-of-the-art facilities provide the perfect environment for holistic development.</p>
                    <p class="text-gray-600 text-lg mb-8 leading-relaxed">We focus not just on academic brilliance, but also on instilling strong moral values, creativity, and critical thinking skills. We invite you to join our vibrant learning community.</p>
                    <div class="flex items-center space-x-4 mb-8">
                        <div>
                            <h4 class="text-xl font-bold text-primary-900">Mr. Ram Kumar Sharma</h4>
                            <p class="text-secondary-600 font-medium">Principal</p>
                        </div>
                    </div>
                    <a href="about.html" class="btn-primary flex inline-flex items-center">Read Full Message <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i></a>
                </div>
            </div>
        </div>
    </section>
`;

const ABOUT_CONTENT = `
    <!-- Page Header -->
    <section class="bg-primary-900 pt-32 pb-20 text-center relative overflow-hidden">
        <div class="absolute inset-0 z-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="About Us" class="w-full h-full object-cover" />
        </div>
        <div class="container mx-auto px-4 relative z-10">
            <h1 class="text-5xl font-bold text-white mb-4">About Us</h1>
            <p class="text-blue-100 text-lg max-w-2xl mx-auto">Discover our history, mission, and the core values that drive Vidyodaya Shishu Sadan.</p>
            <div class="flex items-center justify-center mt-6 text-sm font-medium text-blue-200">
                <a href="index.html" class="hover:text-white transition">Home</a>
                <i data-lucide="chevron-right" class="w-4 h-4 mx-2"></i>
                <span class="text-secondary-400">About Us</span>
            </div>
        </div>
    </section>

    <!-- Introduction -->
    <section class="section-padding bg-white">
        <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row items-center gap-16">
                <div class="lg:w-1/2" data-aos="fade-right">
                    <span class="text-secondary-600 font-bold tracking-wider uppercase text-sm">Our Story</span>
                    <h2 class="text-4xl font-bold mt-2 mb-6 text-primary-900">A Legacy of Academic Excellence in Gauradaha</h2>
                    <p class="text-gray-600 text-lg mb-6 leading-relaxed">Established with a vision to provide quality education in Gauradaha-1, Jhapa, Vidyodaya Shishu Sadan has grown into one of the most prestigious educational institutions in the region. We are committed to fostering an environment where students can discover their potential and develop into responsible global citizens.</p>
                    <p class="text-gray-600 text-lg mb-8 leading-relaxed">Our approach blends traditional moral values with modern teaching methodologies. We believe that true education extends beyond the classroom, encompassing character building, physical fitness, and creative expression.</p>
                    
                    <div class="grid grid-cols-2 gap-6 mt-8">
                        <div class="flex items-start">
                            <div class="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 mr-4 flex-shrink-0">
                                <i data-lucide="target" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-primary-900 mb-1">Our Mission</h4>
                                <p class="text-sm text-gray-500">To provide holistic education that empowers students.</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4 flex-shrink-0">
                                <i data-lucide="eye" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-primary-900 mb-1">Our Vision</h4>
                                <p class="text-sm text-gray-500">To be a center of excellence in modern education.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:w-1/2 relative" data-aos="fade-left">
                    <div class="grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Students" class="rounded-2xl shadow-lg h-64 object-cover w-full mt-8">
                        <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Classroom" class="rounded-2xl shadow-lg h-64 object-cover w-full">
                    </div>
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-secondary-500 rounded-full flex items-center justify-center shadow-xl border-8 border-white">
                        <div class="text-center text-primary-900">
                            <span class="block text-2xl font-bold">15+</span>
                            <span class="block text-xs font-bold uppercase">Years</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

const ACADEMICS_CONTENT = `
    <!-- Page Header -->
    <section class="bg-primary-900 pt-32 pb-20 text-center relative overflow-hidden">
        <div class="absolute inset-0 z-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Academics" class="w-full h-full object-cover" />
        </div>
        <div class="container mx-auto px-4 relative z-10">
            <h1 class="text-5xl font-bold text-white mb-4">Academics</h1>
            <p class="text-blue-100 text-lg max-w-2xl mx-auto">Explore our comprehensive curriculum and modern teaching methodologies.</p>
        </div>
    </section>

    <section class="section-padding">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Program 1 -->
                <div class="card p-8 border-t-4 border-primary-500" data-aos="fade-up">
                    <div class="w-16 h-16 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                        <i data-lucide="baby" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-primary-900 mb-3">Pre-Primary</h3>
                    <p class="text-gray-600 mb-4">Nursery to UKG</p>
                    <p class="text-gray-500 text-sm leading-relaxed">Play-based learning focusing on motor skills, basic language, and social interaction in a nurturing environment.</p>
                </div>
                <!-- Program 2 -->
                <div class="card p-8 border-t-4 border-secondary-500" data-aos="fade-up" data-aos-delay="100">
                    <div class="w-16 h-16 bg-secondary-100 text-secondary-600 rounded-xl flex items-center justify-center mb-6">
                        <i data-lucide="backpack" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-primary-900 mb-3">Basic Level</h3>
                    <p class="text-gray-600 mb-4">Grade 1 to 8</p>
                    <p class="text-gray-500 text-sm leading-relaxed">Foundational knowledge in core subjects, critical thinking, and introduction to computer science and extracurriculars.</p>
                </div>
                <!-- Program 3 -->
                <div class="card p-8 border-t-4 border-green-500" data-aos="fade-up" data-aos-delay="200">
                    <div class="w-16 h-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                        <i data-lucide="graduation-cap" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-primary-900 mb-3">Secondary Level</h3>
                    <p class="text-gray-600 mb-4">Grade 9 to 12</p>
                    <p class="text-gray-500 text-sm leading-relaxed">Rigorous academic preparation for SEE and beyond, with specialized streams and career counseling.</p>
                </div>
            </div>
        </div>
    </section>
`;

const FACILITIES_CONTENT = `
    <section class="bg-primary-900 pt-32 pb-20 text-center relative overflow-hidden">
        <div class="container mx-auto px-4 relative z-10">
            <h1 class="text-5xl font-bold text-white mb-4">Our Facilities</h1>
            <p class="text-blue-100 text-lg max-w-2xl mx-auto">State-of-the-art infrastructure for holistic development.</p>
        </div>
    </section>

    <section class="section-padding bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="card group" data-aos="fade-up">
                    <div class="h-48 overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Computer Lab" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                        <div class="absolute inset-0 bg-primary-900/20 group-hover:bg-transparent transition duration-500"></div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-primary-900 mb-2 flex items-center"><i data-lucide="monitor" class="w-5 h-5 mr-2 text-secondary-500"></i> Computer Lab</h3>
                        <p class="text-gray-600">Modern computing facility with high-speed internet and latest software for hands-on learning.</p>
                    </div>
                </div>
                
                <div class="card group" data-aos="fade-up" data-aos-delay="100">
                    <div class="h-48 overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Science Lab" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-primary-900 mb-2 flex items-center"><i data-lucide="flask-conical" class="w-5 h-5 mr-2 text-secondary-500"></i> Science Lab</h3>
                        <p class="text-gray-600">Fully equipped physics, chemistry, and biology labs for practical experiments.</p>
                    </div>
                </div>
                
                <div class="card group" data-aos="fade-up" data-aos-delay="200">
                    <div class="h-48 overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Library" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-primary-900 mb-2 flex items-center"><i data-lucide="book-open" class="w-5 h-5 mr-2 text-secondary-500"></i> Library</h3>
                        <p class="text-gray-600">A vast collection of books, journals, and digital resources to foster a reading culture.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

// Dynamic Content loading
let galleryData = [];
try {
    const raw = fs.readFileSync(path.join(baseDir, 'data', 'gallery.json'), 'utf-8');
    const parsed = JSON.parse(raw);
    galleryData = Array.isArray(parsed) ? parsed : (parsed.gallery || []);
    galleryData = galleryData.slice(0, 50);
} catch (e) { console.error("Gallery data load error", e); }

let GALLERY_CONTENT = `
    <section class="bg-primary-900 pt-32 pb-20 text-center relative overflow-hidden">
        <div class="container mx-auto px-4 relative z-10">
            <h1 class="text-5xl font-bold text-white mb-4">Gallery</h1>
            <p class="text-blue-100 text-lg max-w-2xl mx-auto">Glimpses of life at Vidyodaya Shishu Sadan.</p>
        </div>
    </section>

    <section class="section-padding">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[250px]">
`;

galleryData.forEach(item => {
    let delayAttr = item.delay ? ` data-aos-delay="${item.delay}"` : "";
    let zoomIcon = item.spanClass ? '<span class="text-white font-bold text-xl"><i data-lucide="zoom-in" class="w-8 h-8 mb-2 mx-auto"></i> View Image</span>' : '<i data-lucide="zoom-in" class="w-8 h-8 text-white"></i>';
    
    GALLERY_CONTENT += `
                <a href="#" class="gallery-item block relative overflow-hidden rounded-xl group ${item.spanClass || ''}" data-aos="fade-up"${delayAttr}>
                    <img src="${item.image}" alt="${item.alt}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                    <div class="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                        ${zoomIcon}
                    </div>
                </a>`;
});

GALLERY_CONTENT += `
            </div>
        </div>
    </section>
`;

let noticesData = [];
try {
    const raw = fs.readFileSync(path.join(baseDir, 'data', 'notices.json'), 'utf-8');
    const parsed = JSON.parse(raw);
    noticesData = Array.isArray(parsed) ? parsed : (parsed.notices || []);
    noticesData = noticesData.slice(0, 50);
} catch (e) { console.error("Notices data load error", e); }

let NOTICES_CONTENT = `
    <section class="bg-primary-900 pt-32 pb-20 text-center relative overflow-hidden">
        <div class="container mx-auto px-4 relative z-10">
            <h1 class="text-5xl font-bold text-white mb-4">Notices & Updates</h1>
            <p class="text-blue-100 text-lg max-w-2xl mx-auto">Stay informed with the latest announcements.</p>
        </div>
    </section>

    <section class="section-padding">
        <div class="container mx-auto px-4 max-w-4xl">
            <div class="space-y-6">
`;

noticesData.forEach(item => {
    let urgentBadge = item.isUrgent ? '<span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">Urgent</span>' : "";
    let postedText = item.postedText ? `<span class="text-sm text-gray-500 flex items-center"><i data-lucide="clock" class="w-3 h-3 mr-1"></i> ${item.postedText}</span>` : "";
    
    let metaDiv = "";
    if (urgentBadge || postedText) {
        metaDiv = `<div class="flex items-center gap-2 mb-2">${urgentBadge}${postedText}</div>`;
    }
        
    NOTICES_CONTENT += `
                <div class="bg-white p-6 rounded-2xl shadow-md border-l-4 border-${item.colorClass}-500 hover:shadow-lg transition flex flex-col md:flex-row gap-6 items-center" data-aos="fade-up">
                    <div class="bg-gray-50 p-4 rounded-xl text-center min-w-[100px] border border-gray-100">
                        <span class="block text-2xl font-bold text-primary-600">${item.date}</span>
                        <span class="block text-sm uppercase font-bold text-gray-500">${item.month}</span>
                    </div>
                    <div class="flex-grow">
                        ${metaDiv}
                        <h3 class="text-xl font-bold text-primary-900 mb-2">${item.title}</h3>
                        <p class="text-gray-600">${item.description}</p>
                    </div>
                    <div>
                        <a href="${item.link}" class="btn-outline !py-2 !px-4 text-sm whitespace-nowrap">${item.linkText}</a>
                    </div>
                </div>`;
});

NOTICES_CONTENT += `
            </div>
        </div>
    </section>
`;

const CONTACT_CONTENT = `
    <section class="bg-primary-900 pt-32 pb-20 text-center relative overflow-hidden">
        <div class="container mx-auto px-4 relative z-10">
            <h1 class="text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p class="text-blue-100 text-lg max-w-2xl mx-auto">We'd love to hear from you. Get in touch with us.</p>
        </div>
    </section>

    <section class="section-padding -mt-10 relative z-20">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Info -->
                <div class="lg:col-span-1 space-y-6">
                    <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100" data-aos="fade-up">
                        <h3 class="text-2xl font-bold text-primary-900 mb-6">Contact Information</h3>
                        <ul class="space-y-6">
                            <li class="flex items-start">
                                <div class="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    <i data-lucide="map-pin" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-primary-900">Address</h4>
                                    <p class="text-gray-600 mt-1">Gauradaha-1, Jhapa<br>Koshi Province, Nepal</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <div class="w-12 h-12 bg-secondary-50 text-secondary-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    <i data-lucide="phone" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-primary-900">Phone</h4>
                                    <p class="text-gray-600 mt-1">+977-23-480194</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <div class="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    <i data-lucide="mail" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-primary-900">Email</h4>
                                    <p class="text-gray-600 mt-1">info@vidyodayaschool.edu.np</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <!-- Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100" data-aos="fade-left">
                        <h3 class="text-2xl font-bold text-primary-900 mb-6">Send us a Message</h3>
                        <form id="contactForm" name="contact" method="POST" data-netlify="true" class="space-y-6">
                            <input type="hidden" name="form-name" value="contact">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input type="text" id="contactName" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" placeholder="John Doe">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input type="email" id="contactEmail" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" placeholder="john@example.com">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input type="text" id="contactSubject" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" placeholder="Admission Inquiry">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea id="contactMessage" required rows="5" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" placeholder="Your message here..."></textarea>
                            </div>
                            <button type="submit" class="btn-primary w-full text-lg">Send Message</button>
                            <p id="contactStatus" class="mt-4 font-bold text-center hidden"></p>
                        </form>
                        <script>
                            document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
                                e.preventDefault();
                                const status = document.getElementById('contactStatus');
                                status.classList.remove('hidden', 'text-green-600', 'text-red-600');
                                status.innerText = "Sending...";
                                
                                const data = {
                                    name: document.getElementById('contactName').value,
                                    email: document.getElementById('contactEmail').value,
                                    subject: document.getElementById('contactSubject').value,
                                    message: document.getElementById('contactMessage').value,
                                    date: new Date().toLocaleDateString()
                                };
                                
                                try {
                                    // If we are on Netlify, we use standard form submission
                                    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                                        const formData = new FormData(e.target);
                                        const res = await fetch("/", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                            body: new URLSearchParams(formData).toString(),
                                        });
                                        if (res.ok) {
                                            status.innerText = "Message sent successfully to Netlify!";
                                            status.classList.add('text-green-600');
                                            e.target.reset();
                                        } else { throw new Error("Netlify submission failed"); }
                                        return;
                                    }

                                    // Local Fallback (for node server.js)
                                    const res = await fetch('/api/messages', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(data)
                                    });
                                    if(res.ok) {
                                        status.innerText = "Message sent successfully!";
                                        status.classList.add('text-green-600');
                                        document.getElementById('contactForm').reset();
                                    } else {
                                        status.innerText = "Failed to send message. Please try again.";
                                        status.classList.add('text-red-600');
                                    }
                                } catch (err) {
                                    status.innerText = "Error connecting to server.";
                                    status.classList.add('text-red-600');
                                }
                            });
                        </script>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Map -->
    <section class="h-96 w-full">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d14258.916960411855!2d87.6836968!3d26.6890317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e58e65873a70cb%3A0xf598a27e3ffb0c53!2sGauradaha%20Jhapa!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </section>
`;

const ERROR_404_CONTENT = `
    <section class="bg-primary-900 pt-40 pb-32 text-center relative overflow-hidden flex flex-col justify-center min-h-[70vh]">
        <div class="container mx-auto px-4 relative z-10">
            <h1 class="text-9xl font-bold text-white mb-4 drop-shadow-lg">404</h1>
            <h2 class="text-3xl font-bold text-blue-100 mb-6">Oops! Page Not Found</h2>
            <p class="text-blue-200 text-lg max-w-2xl mx-auto mb-10">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <a href="/" class="bg-secondary-500 text-primary-900 px-8 py-4 rounded-full font-bold hover:bg-secondary-600 transition shadow-lg text-lg inline-flex items-center gap-2">
                <i data-lucide="home" class="w-5 h-5"></i> Return to Homepage
            </a>
        </div>
    </section>
`;

// Generate pages
generatePage("index.html", "Home", "Vidyodaya Shishu Sadan School in Gauradaha-1, Jhapa", "home", HOME_CONTENT, true);
generatePage("about.html", "About Us", "Learn about Vidyodaya Shishu Sadan", "about", ABOUT_CONTENT);
generatePage("academics.html", "Academics", "Our programs and curriculum", "academics", ACADEMICS_CONTENT);
generatePage("facilities.html", "Facilities", "State of the art facilities", "facilities", FACILITIES_CONTENT);
generatePage("gallery.html", "Gallery", "Life at Vidyodaya", "gallery", GALLERY_CONTENT);
generatePage("notices.html", "Notices", "Latest notices and updates", "notices", NOTICES_CONTENT);
generatePage("contact.html", "Contact Us", "Get in touch with us", "contact", CONTACT_CONTENT);
generatePage("404.html", "Page Not Found", "404 Error", "404", ERROR_404_CONTENT);

console.log("HTML Pages generated successfully!");
