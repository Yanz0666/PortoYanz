CREATE DATABASE portofolio_pa;
USE portofolio_pa;
-- Bikin tabel master users dulu
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bikin tabel profil
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_lengkap VARCHAR(100),
    nama_panggilan VARCHAR(50),
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,
    email VARCHAR(100),
    telepon VARCHAR(20),
    universitas VARCHAR(100),
    fakultas VARCHAR(100),
    prodi VARCHAR(100),
    semester VARCHAR(20),
    alamat TEXT,
    foto_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bikin tabel skills
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_skill VARCHAR(50),
    icon_class VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bikin tabel experiences
CREATE TABLE experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    posisi VARCHAR(100),
    perusahaan VARCHAR(100),
    durasi VARCHAR(50),
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bikin tabel projects
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    judul VARCHAR(100),
    deskripsi TEXT,
    gambar_url VARCHAR(255),
    link_project VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);