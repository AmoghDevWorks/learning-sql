import React, { useState, useContext, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Phone, ShoppingCart, UserPlus, MapPinHouse  } from 'lucide-react';
import axios from 'axios'
import userContext from '../utils/UserContext'
import { useNavigate } from 'react-router-dom';
import roleContext from '../utils/RoleContext';
import { Bounce, ToastContainer, toast } from 'react-toastify';

const indianDistricts = [
  // Andhra Pradesh
  { value: "Anantapur, Andhra Pradesh", label: "Anantapur, Andhra Pradesh" },
  { value: "Chittoor, Andhra Pradesh", label: "Chittoor, Andhra Pradesh" },
  { value: "East Godavari, Andhra Pradesh", label: "East Godavari, Andhra Pradesh" },
  { value: "Guntur, Andhra Pradesh", label: "Guntur, Andhra Pradesh" },
  { value: "Krishna, Andhra Pradesh", label: "Krishna, Andhra Pradesh" },
  { value: "Kurnool, Andhra Pradesh", label: "Kurnool, Andhra Pradesh" },
  { value: "Nellore, Andhra Pradesh", label: "Nellore, Andhra Pradesh" },
  { value: "Prakasam, Andhra Pradesh", label: "Prakasam, Andhra Pradesh" },
  { value: "Srikakulam, Andhra Pradesh", label: "Srikakulam, Andhra Pradesh" },
  { value: "Visakhapatnam, Andhra Pradesh", label: "Visakhapatnam, Andhra Pradesh" },
  { value: "Vizianagaram, Andhra Pradesh", label: "Vizianagaram, Andhra Pradesh" },
  { value: "West Godavari, Andhra Pradesh", label: "West Godavari, Andhra Pradesh" },
  { value: "YSR Kadapa, Andhra Pradesh", label: "YSR Kadapa, Andhra Pradesh" },

  // Arunachal Pradesh
  { value: "Tawang, Arunachal Pradesh", label: "Tawang, Arunachal Pradesh" },
  { value: "West Kameng, Arunachal Pradesh", label: "West Kameng, Arunachal Pradesh" },
  { value: "East Kameng, Arunachal Pradesh", label: "East Kameng, Arunachal Pradesh" },
  { value: "Papum Pare, Arunachal Pradesh", label: "Papum Pare, Arunachal Pradesh" },
  { value: "Kurung Kumey, Arunachal Pradesh", label: "Kurung Kumey, Arunachal Pradesh" },
  { value: "Kra Daadi, Arunachal Pradesh", label: "Kra Daadi, Arunachal Pradesh" },
  { value: "Lower Subansiri, Arunachal Pradesh", label: "Lower Subansiri, Arunachal Pradesh" },
  { value: "Upper Subansiri, Arunachal Pradesh", label: "Upper Subansiri, Arunachal Pradesh" },
  { value: "West Siang, Arunachal Pradesh", label: "West Siang, Arunachal Pradesh" },
  { value: "East Siang, Arunachal Pradesh", label: "East Siang, Arunachal Pradesh" },
  { value: "Siang, Arunachal Pradesh", label: "Siang, Arunachal Pradesh" },
  { value: "Upper Siang, Arunachal Pradesh", label: "Upper Siang, Arunachal Pradesh" },
  { value: "Lower Siang, Arunachal Pradesh", label: "Lower Siang, Arunachal Pradesh" },
  { value: "Lower Dibang Valley, Arunachal Pradesh", label: "Lower Dibang Valley, Arunachal Pradesh" },
  { value: "Dibang Valley, Arunachal Pradesh", label: "Dibang Valley, Arunachal Pradesh" },
  { value: "Anjaw, Arunachal Pradesh", label: "Anjaw, Arunachal Pradesh" },
  { value: "Lohit, Arunachal Pradesh", label: "Lohit, Arunachal Pradesh" },
  { value: "Namsai, Arunachal Pradesh", label: "Namsai, Arunachal Pradesh" },
  { value: "Changlang, Arunachal Pradesh", label: "Changlang, Arunachal Pradesh" },
  { value: "Tirap, Arunachal Pradesh", label: "Tirap, Arunachal Pradesh" },
  { value: "Longding, Arunachal Pradesh", label: "Longding, Arunachal Pradesh" },

  // Assam
  { value: "Baksa, Assam", label: "Baksa, Assam" },
  { value: "Barpeta, Assam", label: "Barpeta, Assam" },
  { value: "Biswanath, Assam", label: "Biswanath, Assam" },
  { value: "Bongaigaon, Assam", label: "Bongaigaon, Assam" },
  { value: "Cachar, Assam", label: "Cachar, Assam" },
  { value: "Charaideo, Assam", label: "Charaideo, Assam" },
  { value: "Chirang, Assam", label: "Chirang, Assam" },
  { value: "Darrang, Assam", label: "Darrang, Assam" },
  { value: "Dhemaji, Assam", label: "Dhemaji, Assam" },
  { value: "Dhubri, Assam", label: "Dhubri, Assam" },
  { value: "Dibrugarh, Assam", label: "Dibrugarh, Assam" },
  { value: "Goalpara, Assam", label: "Goalpara, Assam" },
  { value: "Golaghat, Assam", label: "Golaghat, Assam" },
  { value: "Guwahati, Assam", label: "Guwahati, Assam" },
  { value: "Hailakandi, Assam", label: "Hailakandi, Assam" },
  { value: "Hojai, Assam", label: "Hojai, Assam" },
  { value: "Jorhat, Assam", label: "Jorhat, Assam" },
  { value: "Kamrup, Assam", label: "Kamrup, Assam" },
  { value: "Kamrup Metropolitan, Assam", label: "Kamrup Metropolitan, Assam" },
  { value: "Karbi Anglong, Assam", label: "Karbi Anglong, Assam" },
  { value: "Karimganj, Assam", label: "Karimganj, Assam" },
  { value: "Kokrajhar, Assam", label: "Kokrajhar, Assam" },
  { value: "Lakhimpur, Assam", label: "Lakhimpur, Assam" },
  { value: "Majuli, Assam", label: "Majuli, Assam" },
  { value: "Morigaon, Assam", label: "Morigaon, Assam" },
  { value: "Nagaon, Assam", label: "Nagaon, Assam" },
  { value: "Nalbari, Assam", label: "Nalbari, Assam" },
  { value: "Dima Hasao, Assam", label: "Dima Hasao, Assam" },
  { value: "Sivasagar, Assam", label: "Sivasagar, Assam" },
  { value: "Sonitpur, Assam", label: "Sonitpur, Assam" },
  { value: "South Salmara-Mankachar, Assam", label: "South Salmara-Mankachar, Assam" },
  { value: "Tinsukia, Assam", label: "Tinsukia, Assam" },
  { value: "Udalguri, Assam", label: "Udalguri, Assam" },
  { value: "West Karbi Anglong, Assam", label: "West Karbi Anglong, Assam" },

  // Bihar
  { value: "Araria, Bihar", label: "Araria, Bihar" },
  { value: "Arwal, Bihar", label: "Arwal, Bihar" },
  { value: "Aurangabad, Bihar", label: "Aurangabad, Bihar" },
  { value: "Banka, Bihar", label: "Banka, Bihar" },
  { value: "Begusarai, Bihar", label: "Begusarai, Bihar" },
  { value: "Bhagalpur, Bihar", label: "Bhagalpur, Bihar" },
  { value: "Bhojpur, Bihar", label: "Bhojpur, Bihar" },
  { value: "Buxar, Bihar", label: "Buxar, Bihar" },
  { value: "Darbhanga, Bihar", label: "Darbhanga, Bihar" },
  { value: "East Champaran, Bihar", label: "East Champaran, Bihar" },
  { value: "Gaya, Bihar", label: "Gaya, Bihar" },
  { value: "Gopalganj, Bihar", label: "Gopalganj, Bihar" },
  { value: "Jamui, Bihar", label: "Jamui, Bihar" },
  { value: "Jehanabad, Bihar", label: "Jehanabad, Bihar" },
  { value: "Kaimur, Bihar", label: "Kaimur, Bihar" },
  { value: "Katihar, Bihar", label: "Katihar, Bihar" },
  { value: "Khagaria, Bihar", label: "Khagaria, Bihar" },
  { value: "Kishanganj, Bihar", label: "Kishanganj, Bihar" },
  { value: "Lakhisarai, Bihar", label: "Lakhisarai, Bihar" },
  { value: "Madhepura, Bihar", label: "Madhepura, Bihar" },
  { value: "Madhubani, Bihar", label: "Madhubani, Bihar" },
  { value: "Munger, Bihar", label: "Munger, Bihar" },
  { value: "Muzaffarpur, Bihar", label: "Muzaffarpur, Bihar" },
  { value: "Nalanda, Bihar", label: "Nalanda, Bihar" },
  { value: "Nawada, Bihar", label: "Nawada, Bihar" },
  { value: "Patna, Bihar", label: "Patna, Bihar" },
  { value: "Purnia, Bihar", label: "Purnia, Bihar" },
  { value: "Rohtas, Bihar", label: "Rohtas, Bihar" },
  { value: "Saharsa, Bihar", label: "Saharsa, Bihar" },
  { value: "Samastipur, Bihar", label: "Samastipur, Bihar" },
  { value: "Saran, Bihar", label: "Saran, Bihar" },
  { value: "Sheikhpura, Bihar", label: "Sheikhpura, Bihar" },
  { value: "Sheohar, Bihar", label: "Sheohar, Bihar" },
  { value: "Sitamarhi, Bihar", label: "Sitamarhi, Bihar" },
  { value: "Siwan, Bihar", label: "Siwan, Bihar" },
  { value: "Supaul, Bihar", label: "Supaul, Bihar" },
  { value: "Vaishali, Bihar", label: "Vaishali, Bihar" },
  { value: "West Champaran, Bihar", label: "West Champaran, Bihar" },

  // Chhattisgarh
  { value: "Balod, Chhattisgarh", label: "Balod, Chhattisgarh" },
  { value: "Baloda Bazar, Chhattisgarh", label: "Baloda Bazar, Chhattisgarh" },
  { value: "Balrampur, Chhattisgarh", label: "Balrampur, Chhattisgarh" },
  { value: "Bastar, Chhattisgarh", label: "Bastar, Chhattisgarh" },
  { value: "Bemetara, Chhattisgarh", label: "Bemetara, Chhattisgarh" },
  { value: "Bijapur, Chhattisgarh", label: "Bijapur, Chhattisgarh" },
  { value: "Bilaspur, Chhattisgarh", label: "Bilaspur, Chhattisgarh" },
  { value: "Dantewada, Chhattisgarh", label: "Dantewada, Chhattisgarh" },
  { value: "Dhamtari, Chhattisgarh", label: "Dhamtari, Chhattisgarh" },
  { value: "Durg, Chhattisgarh", label: "Durg, Chhattisgarh" },
  { value: "Gariaband, Chhattisgarh", label: "Gariaband, Chhattisgarh" },
  { value: "Gaurela Pendra Marwahi, Chhattisgarh", label: "Gaurela Pendra Marwahi, Chhattisgarh" },
  { value: "Janjgir Champa, Chhattisgarh", label: "Janjgir Champa, Chhattisgarh" },
  { value: "Jashpur, Chhattisgarh", label: "Jashpur, Chhattisgarh" },
  { value: "Kabirdham, Chhattisgarh", label: "Kabirdham, Chhattisgarh" },
  { value: "Kanker, Chhattisgarh", label: "Kanker, Chhattisgarh" },
  { value: "Kondagaon, Chhattisgarh", label: "Kondagaon, Chhattisgarh" },
  { value: "Korba, Chhattisgarh", label: "Korba, Chhattisgarh" },
  { value: "Korea, Chhattisgarh", label: "Korea, Chhattisgarh" },
  { value: "Mahasamund, Chhattisgarh", label: "Mahasamund, Chhattisgarh" },
  { value: "Mungeli, Chhattisgarh", label: "Mungeli, Chhattisgarh" },
  { value: "Narayanpur, Chhattisgarh", label: "Narayanpur, Chhattisgarh" },
  { value: "Raigarh, Chhattisgarh", label: "Raigarh, Chhattisgarh" },
  { value: "Raipur, Chhattisgarh", label: "Raipur, Chhattisgarh" },
  { value: "Rajnandgaon, Chhattisgarh", label: "Rajnandgaon, Chhattisgarh" },
  { value: "Sukma, Chhattisgarh", label: "Sukma, Chhattisgarh" },
  { value: "Surajpur, Chhattisgarh", label: "Surajpur, Chhattisgarh" },
  { value: "Surguja, Chhattisgarh", label: "Surguja, Chhattisgarh" },

  // Delhi
  { value: "Central Delhi, Delhi", label: "Central Delhi, Delhi" },
  { value: "East Delhi, Delhi", label: "East Delhi, Delhi" },
  { value: "New Delhi, Delhi", label: "New Delhi, Delhi" },
  { value: "North Delhi, Delhi", label: "North Delhi, Delhi" },
  { value: "North East Delhi, Delhi", label: "North East Delhi, Delhi" },
  { value: "North West Delhi, Delhi", label: "North West Delhi, Delhi" },
  { value: "Shahdara, Delhi", label: "Shahdara, Delhi" },
  { value: "South Delhi, Delhi", label: "South Delhi, Delhi" },
  { value: "South East Delhi, Delhi", label: "South East Delhi, Delhi" },
  { value: "South West Delhi, Delhi", label: "South West Delhi, Delhi" },
  { value: "West Delhi, Delhi", label: "West Delhi, Delhi" },

  // Goa
  { value: "North Goa, Goa", label: "North Goa, Goa" },
  { value: "South Goa, Goa", label: "South Goa, Goa" },

  // Gujarat
  { value: "Ahmedabad, Gujarat", label: "Ahmedabad, Gujarat" },
  { value: "Amreli, Gujarat", label: "Amreli, Gujarat" },
  { value: "Anand, Gujarat", label: "Anand, Gujarat" },
  { value: "Aravalli, Gujarat", label: "Aravalli, Gujarat" },
  { value: "Banaskantha, Gujarat", label: "Banaskantha, Gujarat" },
  { value: "Bharuch, Gujarat", label: "Bharuch, Gujarat" },
  { value: "Bhavnagar, Gujarat", label: "Bhavnagar, Gujarat" },
  { value: "Botad, Gujarat", label: "Botad, Gujarat" },
  { value: "Chhota Udepur, Gujarat", label: "Chhota Udepur, Gujarat" },
  { value: "Dahod, Gujarat", label: "Dahod, Gujarat" },
  { value: "Dang, Gujarat", label: "Dang, Gujarat" },
  { value: "Devbhoomi Dwarka, Gujarat", label: "Devbhoomi Dwarka, Gujarat" },
  { value: "Gandhinagar, Gujarat", label: "Gandhinagar, Gujarat" },
  { value: "Gir Somnath, Gujarat", label: "Gir Somnath, Gujarat" },
  { value: "Jamnagar, Gujarat", label: "Jamnagar, Gujarat" },
  { value: "Junagadh, Gujarat", label: "Junagadh, Gujarat" },
  { value: "Kachchh, Gujarat", label: "Kachchh, Gujarat" },
  { value: "Kheda, Gujarat", label: "Kheda, Gujarat" },
  { value: "Mahisagar, Gujarat", label: "Mahisagar, Gujarat" },
  { value: "Mehsana, Gujarat", label: "Mehsana, Gujarat" },
  { value: "Morbi, Gujarat", label: "Morbi, Gujarat" },
  { value: "Narmada, Gujarat", label: "Narmada, Gujarat" },
  { value: "Navsari, Gujarat", label: "Navsari, Gujarat" },
  { value: "Panchmahal, Gujarat", label: "Panchmahal, Gujarat" },
  { value: "Patan, Gujarat", label: "Patan, Gujarat" },
  { value: "Porbandar, Gujarat", label: "Porbandar, Gujarat" },
  { value: "Rajkot, Gujarat", label: "Rajkot, Gujarat" },
  { value: "Sabarkantha, Gujarat", label: "Sabarkantha, Gujarat" },
  { value: "Surat, Gujarat", label: "Surat, Gujarat" },
  { value: "Surendranagar, Gujarat", label: "Surendranagar, Gujarat" },
  { value: "Tapi, Gujarat", label: "Tapi, Gujarat" },
  { value: "Vadodara, Gujarat", label: "Vadodara, Gujarat" },
  { value: "Valsad, Gujarat", label: "Valsad, Gujarat" },

  // Haryana
  { value: "Ambala, Haryana", label: "Ambala, Haryana" },
  { value: "Bhiwani, Haryana", label: "Bhiwani, Haryana" },
  { value: "Charkhi Dadri, Haryana", label: "Charkhi Dadri, Haryana" },
  { value: "Faridabad, Haryana", label: "Faridabad, Haryana" },
  { value: "Fatehabad, Haryana", label: "Fatehabad, Haryana" },
  { value: "Gurugram, Haryana", label: "Gurugram, Haryana" },
  { value: "Hisar, Haryana", label: "Hisar, Haryana" },
  { value: "Jhajjar, Haryana", label: "Jhajjar, Haryana" },
  { value: "Jind, Haryana", label: "Jind, Haryana" },
  { value: "Kaithal, Haryana", label: "Kaithal, Haryana" },
  { value: "Karnal, Haryana", label: "Karnal, Haryana" },
  { value: "Kurukshetra, Haryana", label: "Kurukshetra, Haryana" },
  { value: "Mahendragarh, Haryana", label: "Mahendragarh, Haryana" },
  { value: "Mewat, Haryana", label: "Mewat, Haryana" },
  { value: "Palwal, Haryana", label: "Palwal, Haryana" },
  { value: "Panchkula, Haryana", label: "Panchkula, Haryana" },
  { value: "Panipat, Haryana", label: "Panipat, Haryana" },
  { value: "Rewari, Haryana", label: "Rewari, Haryana" },
  { value: "Rohtak, Haryana", label: "Rohtak, Haryana" },
  { value: "Sirsa, Haryana", label: "Sirsa, Haryana" },
  { value: "Sonipat, Haryana", label: "Sonipat, Haryana" },
  { value: "Yamunanagar, Haryana", label: "Yamunanagar, Haryana" },

  // Himachal Pradesh
  { value: "Bilaspur, Himachal Pradesh", label: "Bilaspur, Himachal Pradesh" },
  { value: "Chamba, Himachal Pradesh", label: "Chamba, Himachal Pradesh" },
  { value: "Hamirpur, Himachal Pradesh", label: "Hamirpur, Himachal Pradesh" },
  { value: "Kangra, Himachal Pradesh", label: "Kangra, Himachal Pradesh" },
  { value: "Kinnaur, Himachal Pradesh", label: "Kinnaur, Himachal Pradesh" },
  { value: "Kullu, Himachal Pradesh", label: "Kullu, Himachal Pradesh" },
  { value: "Lahaul and Spiti, Himachal Pradesh", label: "Lahaul and Spiti, Himachal Pradesh" },
  { value: "Mandi, Himachal Pradesh", label: "Mandi, Himachal Pradesh" },
  { value: "Shimla, Himachal Pradesh", label: "Shimla, Himachal Pradesh" },
  { value: "Sirmaur, Himachal Pradesh", label: "Sirmaur, Himachal Pradesh" },
  { value: "Solan, Himachal Pradesh", label: "Solan, Himachal Pradesh" },
  { value: "Una, Himachal Pradesh", label: "Una, Himachal Pradesh" },

  // Jharkhand
  { value: "Bokaro, Jharkhand", label: "Bokaro, Jharkhand" },
  { value: "Chatra, Jharkhand", label: "Chatra, Jharkhand" },
  { value: "Deoghar, Jharkhand", label: "Deoghar, Jharkhand" },
  { value: "Dhanbad, Jharkhand", label: "Dhanbad, Jharkhand" },
  { value: "Dumka, Jharkhand", label: "Dumka, Jharkhand" },
  { value: "East Singhbhum, Jharkhand", label: "East Singhbhum, Jharkhand" },
  { value: "Garhwa, Jharkhand", label: "Garhwa, Jharkhand" },
  { value: "Giridih, Jharkhand", label: "Giridih, Jharkhand" },
  { value: "Godda, Jharkhand", label: "Godda, Jharkhand" },
  { value: "Gumla, Jharkhand", label: "Gumla, Jharkhand" },
  { value: "Hazaribagh, Jharkhand", label: "Hazaribagh, Jharkhand" },
  { value: "Jamtara, Jharkhand", label: "Jamtara, Jharkhand" },
  { value: "Khunti, Jharkhand", label: "Khunti, Jharkhand" },
  { value: "Koderma, Jharkhand", label: "Koderma, Jharkhand" },
  { value: "Latehar, Jharkhand", label: "Latehar, Jharkhand" },
  { value: "Lohardaga, Jharkhand", label: "Lohardaga, Jharkhand" },
  { value: "Pakur, Jharkhand", label: "Pakur, Jharkhand" },
  { value: "Palamu, Jharkhand", label: "Palamu, Jharkhand" },
  { value: "Ramgarh, Jharkhand", label: "Ramgarh, Jharkhand" },
  { value: "Ranchi, Jharkhand", label: "Ranchi, Jharkhand" },
  { value: "Sahibganj, Jharkhand", label: "Sahibganj, Jharkhand" },
  { value: "Seraikela Kharsawan, Jharkhand", label: "Seraikela Kharsawan, Jharkhand" },
  { value: "Simdega, Jharkhand", label: "Simdega, Jharkhand" },
  { value: "West Singhbhum, Jharkhand", label: "West Singhbhum, Jharkhand" },

  // Karnataka - Major districts
  { value: "Bagalkot, Karnataka", label: "Bagalkot, Karnataka" },
  { value: "Ballari, Karnataka", label: "Ballari, Karnataka" },
  { value: "Belagavi, Karnataka", label: "Belagavi, Karnataka" },
  { value: "Bengaluru Rural, Karnataka", label: "Bengaluru Rural, Karnataka" },
  { value: "Bengaluru Urban, Karnataka", label: "Bengaluru Urban, Karnataka" },
  { value: "Bidar, Karnataka", label: "Bidar, Karnataka" },
  { value: "Chamarajanagar, Karnataka", label: "Chamarajanagar, Karnataka" },
  { value: "Chikballapur, Karnataka", label: "Chikballapur, Karnataka" },
  { value: "Chikkamagaluru, Karnataka", label: "Chikkamagaluru, Karnataka" },
  { value: "Chitradurga, Karnataka", label: "Chitradurga, Karnataka" },
  { value: "Dakshina Kannada, Karnataka", label: "Dakshina Kannada, Karnataka" },
  { value: "Davanagere, Karnataka", label: "Davanagere, Karnataka" },
  { value: "Dharwad, Karnataka", label: "Dharwad, Karnataka" },
  { value: "Gadag, Karnataka", label: "Gadag, Karnataka" },
  { value: "Hassan, Karnataka", label: "Hassan, Karnataka" },
  { value: "Haveri, Karnataka", label: "Haveri, Karnataka" },
  { value: "Kalaburagi, Karnataka", label: "Kalaburagi, Karnataka" },
  { value: "Kodagu, Karnataka", label: "Kodagu, Karnataka" },
  { value: "Kolar, Karnataka", label: "Kolar, Karnataka" },
  { value: "Koppal, Karnataka", label: "Koppal, Karnataka" },
  { value: "Mandya, Karnataka", label: "Mandya, Karnataka" },
  { value: "Mysuru, Karnataka", label: "Mysuru, Karnataka" },
  { value: "Raichur, Karnataka", label: "Raichur, Karnataka" },
  { value: "Ramanagara, Karnataka", label: "Ramanagara, Karnataka" },
  { value: "Shivamogga, Karnataka", label: "Shivamogga, Karnataka" },
  { value: "Tumakuru, Karnataka", label: "Tumakuru, Karnataka" },
  { value: "Udupi, Karnataka", label: "Udupi, Karnataka" },
  { value: "Uttara Kannada, Karnataka", label: "Uttara Kannada, Karnataka" },
  { value: "Vijayapura, Karnataka", label: "Vijayapura, Karnataka" },
  { value: "Yadgir, Karnataka", label: "Yadgir, Karnataka" },

  // Kerala
  { value: "Alappuzha, Kerala", label: "Alappuzha, Kerala" },
  { value: "Ernakulam, Kerala", label: "Ernakulam, Kerala" },
  { value: "Idukki, Kerala", label: "Idukki, Kerala" },
  { value: "Kannur, Kerala", label: "Kannur, Kerala" },
  { value: "Kasaragod, Kerala", label: "Kasaragod, Kerala" },
  { value: "Kollam, Kerala", label: "Kollam, Kerala" },
  { value: "Kottayam, Kerala", label: "Kottayam, Kerala" },
  { value: "Kozhikode, Kerala", label: "Kozhikode, Kerala" },
  { value: "Malappuram, Kerala", label: "Malappuram, Kerala" },
  { value: "Palakkad, Kerala", label: "Palakkad, Kerala" },
  { value: "Pathanamthitta, Kerala", label: "Pathanamthitta, Kerala" },
  { value: "Thiruvananthapuram, Kerala", label: "Thiruvananthapuram, Kerala" },
  { value: "Thrissur, Kerala", label: "Thrissur, Kerala" },
  { value: "Wayanad, Kerala", label: "Wayanad, Kerala" },

  // Madhya Pradesh
  { value: "Agar Malwa, Madhya Pradesh", label: "Agar Malwa, Madhya Pradesh" },
  { value: "Alirajpur, Madhya Pradesh", label: "Alirajpur, Madhya Pradesh" },
  { value: "Anuppur, Madhya Pradesh", label: "Anuppur, Madhya Pradesh" },
  { value: "Ashoknagar, Madhya Pradesh", label: "Ashoknagar, Madhya Pradesh" },
  { value: "Balaghat, Madhya Pradesh", label: "Balaghat, Madhya Pradesh" },
  { value: "Barwani, Madhya Pradesh", label: "Barwani, Madhya Pradesh" },
  { value: "Betul, Madhya Pradesh", label: "Betul, Madhya Pradesh" },
  { value: "Bhind, Madhya Pradesh", label: "Bhind, Madhya Pradesh" },
  { value: "Bhopal, Madhya Pradesh", label: "Bhopal, Madhya Pradesh" },
  { value: "Burhanpur, Madhya Pradesh", label: "Burhanpur, Madhya Pradesh" },
  { value: "Chhatarpur, Madhya Pradesh", label: "Chhatarpur, Madhya Pradesh" },
  { value: "Chhindwara, Madhya Pradesh", label: "Chhindwara, Madhya Pradesh" },
  { value: "Damoh, Madhya Pradesh", label: "Damoh, Madhya Pradesh" },
  { value: "Datia, Madhya Pradesh", label: "Datia, Madhya Pradesh" },
  { value: "Dewas, Madhya Pradesh", label: "Dewas, Madhya Pradesh" },
  { value: "Dhar, Madhya Pradesh", label: "Dhar, Madhya Pradesh" },
  { value: "Dindori, Madhya Pradesh", label: "Dindori, Madhya Pradesh" },
  { value: "Guna, Madhya Pradesh", label: "Guna, Madhya Pradesh" },
  { value: "Gwalior, Madhya Pradesh", label: "Gwalior, Madhya Pradesh" },
  { value: "Harda, Madhya Pradesh", label: "Harda, Madhya Pradesh" },
  { value: "Hoshangabad, Madhya Pradesh", label: "Hoshangabad, Madhya Pradesh" },
  { value: "Indore, Madhya Pradesh", label: "Indore, Madhya Pradesh" },
  { value: "Jabalpur, Madhya Pradesh", label: "Jabalpur, Madhya Pradesh" },
  { value: "Jhabua, Madhya Pradesh", label: "Jhabua, Madhya Pradesh" },
  { value: "Katni, Madhya Pradesh", label: "Katni, Madhya Pradesh" },
  { value: "Khandwa, Madhya Pradesh", label: "Khandwa, Madhya Pradesh" },
  { value: "Khargone, Madhya Pradesh", label: "Khargone, Madhya Pradesh" },
  { value: "Mandla, Madhya Pradesh", label: "Mandla, Madhya Pradesh" },
  { value: "Mandsaur, Madhya Pradesh", label: "Mandsaur, Madhya Pradesh" },
  { value: "Morena, Madhya Pradesh", label: "Morena, Madhya Pradesh" },
  { value: "Narsinghpur, Madhya Pradesh", label: "Narsinghpur, Madhya Pradesh" },
  { value: "Neemuch, Madhya Pradesh", label: "Neemuch, Madhya Pradesh" },
  { value: "Panna, Madhya Pradesh", label: "Panna, Madhya Pradesh" },
  { value: "Raisen, Madhya Pradesh", label: "Raisen, Madhya Pradesh" },
  { value: "Rajgarh, Madhya Pradesh", label: "Rajgarh, Madhya Pradesh" },
  { value: "Ratlam, Madhya Pradesh", label: "Ratlam, Madhya Pradesh" },
  { value: "Rewa, Madhya Pradesh", label: "Rewa, Madhya Pradesh" },
  { value: "Sagar, Madhya Pradesh", label: "Sagar, Madhya Pradesh" },
  { value: "Satna, Madhya Pradesh", label: "Satna, Madhya Pradesh" },
  { value: "Sehore, Madhya Pradesh", label: "Sehore, Madhya Pradesh" },
  { value: "Seoni, Madhya Pradesh", label: "Seoni, Madhya Pradesh" },
  { value: "Shahdol, Madhya Pradesh", label: "Shahdol, Madhya Pradesh" },
  { value: "Shajapur, Madhya Pradesh", label: "Shajapur, Madhya Pradesh" },
  { value: "Sheopur, Madhya Pradesh", label: "Sheopur, Madhya Pradesh" },
  { value: "Shivpuri, Madhya Pradesh", label: "Shivpuri, Madhya Pradesh" },
  { value: "Sidhi, Madhya Pradesh", label: "Sidhi, Madhya Pradesh" },
  { value: "Singrauli, Madhya Pradesh", label: "Singrauli, Madhya Pradesh" },
  { value: "Tikamgarh, Madhya Pradesh", label: "Tikamgarh, Madhya Pradesh" },
  { value: "Ujjain, Madhya Pradesh", label: "Ujjain, Madhya Pradesh" },
  { value: "Umaria, Madhya Pradesh", label: "Umaria, Madhya Pradesh" },
  { value: "Vidisha, Madhya Pradesh", label: "Vidisha, Madhya Pradesh" },

  // Maharashtra
  { value: "Ahmednagar, Maharashtra", label: "Ahmednagar, Maharashtra" },
  { value: "Akola, Maharashtra", label: "Akola, Maharashtra" },
  { value: "Amravati, Maharashtra", label: "Amravati, Maharashtra" },
  { value: "Aurangabad, Maharashtra", label: "Aurangabad, Maharashtra" },
  { value: "Beed, Maharashtra", label: "Beed, Maharashtra" },
  { value: "Bhandara, Maharashtra", label: "Bhandara, Maharashtra" },
  { value: "Buldhana, Maharashtra", label: "Buldhana, Maharashtra" },
  { value: "Chandrapur, Maharashtra", label: "Chandrapur, Maharashtra" },
  { value: "Dhule, Maharashtra", label: "Dhule, Maharashtra" },
  { value: "Gadchiroli, Maharashtra", label: "Gadchiroli, Maharashtra" },
  { value: "Gondia, Maharashtra", label: "Gondia, Maharashtra" },
  { value: "Hingoli, Maharashtra", label: "Hingoli, Maharashtra" },
  { value: "Jalgaon, Maharashtra", label: "Jalgaon, Maharashtra" },
  { value: "Jalna, Maharashtra", label: "Jalna, Maharashtra" },
  { value: "Kolhapur, Maharashtra", label: "Kolhapur, Maharashtra" },
  { value: "Latur, Maharashtra", label: "Latur, Maharashtra" },
  { value: "Mumbai City, Maharashtra", label: "Mumbai City, Maharashtra" },
  { value: "Mumbai Suburban, Maharashtra", label: "Mumbai Suburban, Maharashtra" },
  { value: "Nagpur, Maharashtra", label: "Nagpur, Maharashtra" },
  { value: "Nanded, Maharashtra", label: "Nanded, Maharashtra" },
  { value: "Nandurbar, Maharashtra", label: "Nandurbar, Maharashtra" },
  { value: "Nashik, Maharashtra", label: "Nashik, Maharashtra" },
  { value: "Osmanabad, Maharashtra", label: "Osmanabad, Maharashtra" },
  { value: "Palghar, Maharashtra", label: "Palghar, Maharashtra" },
  { value: "Parbhani, Maharashtra", label: "Parbhani, Maharashtra" },
  { value: "Pune, Maharashtra", label: "Pune, Maharashtra" },
  { value: "Raigad, Maharashtra", label: "Raigad, Maharashtra" },
  { value: "Ratnagiri, Maharashtra", label: "Ratnagiri, Maharashtra" },
  { value: "Sangli, Maharashtra", label: "Sangli, Maharashtra" },
  { value: "Satara, Maharashtra", label: "Satara, Maharashtra" },
  { value: "Sindhudurg, Maharashtra", label: "Sindhudurg, Maharashtra" },
  { value: "Solapur, Maharashtra", label: "Solapur, Maharashtra" },
  { value: "Thane, Maharashtra", label: "Thane, Maharashtra" },
  { value: "Wardha, Maharashtra", label: "Wardha, Maharashtra" },
  { value: "Washim, Maharashtra", label: "Washim, Maharashtra" },
  { value: "Yavatmal, Maharashtra", label: "Yavatmal, Maharashtra" },

  // Manipur
  { value: "Bishnupur, Manipur", label: "Bishnupur, Manipur" },
  { value: "Chandel, Manipur", label: "Chandel, Manipur" },
  { value: "Churachandpur, Manipur", label: "Churachandpur, Manipur" },
  { value: "Imphal East, Manipur", label: "Imphal East, Manipur" },
  { value: "Imphal West, Manipur", label: "Imphal West, Manipur" },
  { value: "Jiribam, Manipur", label: "Jiribam, Manipur" },
  { value: "Kakching, Manipur", label: "Kakching, Manipur" },
  { value: "Kamjong, Manipur", label: "Kamjong, Manipur" },
  { value: "Kangpokpi, Manipur", label: "Kangpokpi, Manipur" },
  { value: "Noney, Manipur", label: "Noney, Manipur" },
  { value: "Pherzawl, Manipur", label: "Pherzawl, Manipur" },
  { value: "Senapati, Manipur", label: "Senapati, Manipur" },
  { value: "Tamenglong, Manipur", label: "Tamenglong, Manipur" },
  { value: "Tengnoupal, Manipur", label: "Tengnoupal, Manipur" },
  { value: "Thoubal, Manipur", label: "Thoubal, Manipur" },
  { value: "Ukhrul, Manipur", label: "Ukhrul, Manipur" },

  // Meghalaya
  { value: "East Garo Hills, Meghalaya", label: "East Garo Hills, Meghalaya" },
  { value: "East Jaintia Hills, Meghalaya", label: "East Jaintia Hills, Meghalaya" },
  { value: "East Khasi Hills, Meghalaya", label: "East Khasi Hills, Meghalaya" },
  { value: "North Garo Hills, Meghalaya", label: "North Garo Hills, Meghalaya" },
  { value: "Ri Bhoi, Meghalaya", label: "Ri Bhoi, Meghalaya" },
  { value: "South Garo Hills, Meghalaya", label: "South Garo Hills, Meghalaya" },
  { value: "South West Garo Hills, Meghalaya", label: "South West Garo Hills, Meghalaya" },
  { value: "South West Khasi Hills, Meghalaya", label: "South West Khasi Hills, Meghalaya" },
  { value: "West Garo Hills, Meghalaya", label: "West Garo Hills, Meghalaya" },
  { value: "West Jaintia Hills, Meghalaya", label: "West Jaintia Hills, Meghalaya" },
  { value: "West Khasi Hills, Meghalaya", label: "West Khasi Hills, Meghalaya" },

  // Mizoram
  { value: "Aizawl, Mizoram", label: "Aizawl, Mizoram" },
  { value: "Champhai, Mizoram", label: "Champhai, Mizoram" },
  { value: "Hnahthial, Mizoram", label: "Hnahthial, Mizoram" },
  { value: "Khawzawl, Mizoram", label: "Khawzawl, Mizoram" },
  { value: "Kolasib, Mizoram", label: "Kolasib, Mizoram" },
  { value: "Lawngtlai, Mizoram", label: "Lawngtlai, Mizoram" },
  { value: "Lunglei, Mizoram", label: "Lunglei, Mizoram" },
  { value: "Mamit, Mizoram", label: "Mamit, Mizoram" },
  { value: "Saiha, Mizoram", label: "Saiha, Mizoram" },
  { value: "Saitual, Mizoram", label: "Saitual, Mizoram" },
  { value: "Serchhip, Mizoram", label: "Serchhip, Mizoram" },

  // Nagaland
  { value: "Dimapur, Nagaland", label: "Dimapur, Nagaland" },
  { value: "Kiphire, Nagaland", label: "Kiphire, Nagaland" },
  { value: "Kohima, Nagaland", label: "Kohima, Nagaland" },
  { value: "Longleng, Nagaland", label: "Longleng, Nagaland" },
  { value: "Mokokchung, Nagaland", label: "Mokokchung, Nagaland" },
  { value: "Mon, Nagaland", label: "Mon, Nagaland" },
  { value: "Peren, Nagaland", label: "Peren, Nagaland" },
  { value: "Phek, Nagaland", label: "Phek, Nagaland" },
  { value: "Tuensang, Nagaland", label: "Tuensang, Nagaland" },
  { value: "Wokha, Nagaland", label: "Wokha, Nagaland" },
  { value: "Zunheboto, Nagaland", label: "Zunheboto, Nagaland" },

  // Odisha
  { value: "Angul, Odisha", label: "Angul, Odisha" },
  { value: "Balangir, Odisha", label: "Balangir, Odisha" },
  { value: "Balasore, Odisha", label: "Balasore, Odisha" },
  { value: "Bargarh, Odisha", label: "Bargarh, Odisha" },
  { value: "Bhadrak, Odisha", label: "Bhadrak, Odisha" },
  { value: "Boudh, Odisha", label: "Boudh, Odisha" },
  { value: "Cuttack, Odisha", label: "Cuttack, Odisha" },
  { value: "Deogarh, Odisha", label: "Deogarh, Odisha" },
  { value: "Dhenkanal, Odisha", label: "Dhenkanal, Odisha" },
  { value: "Gajapati, Odisha", label: "Gajapati, Odisha" },
  { value: "Ganjam, Odisha", label: "Ganjam, Odisha" },
  { value: "Jagatsinghpur, Odisha", label: "Jagatsinghpur, Odisha" },
  { value: "Jajpur, Odisha", label: "Jajpur, Odisha" },
  { value: "Jharsuguda, Odisha", label: "Jharsuguda, Odisha" },
  { value: "Kalahandi, Odisha", label: "Kalahandi, Odisha" },
  { value: "Kandhamal, Odisha", label: "Kandhamal, Odisha" },
  { value: "Kendrapara, Odisha", label: "Kendrapara, Odisha" },
  { value: "Kendujhar, Odisha", label: "Kendujhar, Odisha" },
  { value: "Khordha, Odisha", label: "Khordha, Odisha" },
  { value: "Koraput, Odisha", label: "Koraput, Odisha" },
  { value: "Malkangiri, Odisha", label: "Malkangiri, Odisha" },
  { value: "Mayurbhanj, Odisha", label: "Mayurbhanj, Odisha" },
  { value: "Nabarangpur, Odisha", label: "Nabarangpur, Odisha" },
  { value: "Nayagarh, Odisha", label: "Nayagarh, Odisha" },
  { value: "Nuapada, Odisha", label: "Nuapada, Odisha" },
  { value: "Puri, Odisha", label: "Puri, Odisha" },
  { value: "Rayagada, Odisha", label: "Rayagada, Odisha" },
  { value: "Sambalpur, Odisha", label: "Sambalpur, Odisha" },
  { value: "Subarnapur, Odisha", label: "Subarnapur, Odisha" },
  { value: "Sundargarh, Odisha", label: "Sundargarh, Odisha" },

  // Punjab 
  { value: "Amritsar, Punjab", label: "Amritsar, Punjab" },
  { value: "Barnala, Punjab", label: "Barnala, Punjab" },
  { value: "Bathinda, Punjab", label: "Bathinda, Punjab" },
  { value: "Faridkot, Punjab", label: "Faridkot, Punjab" },
  { value: "Fatehgarh Sahib, Punjab", label: "Fatehgarh Sahib, Punjab" },
  { value: "Fazilka, Punjab", label: "Fazilka, Punjab" },
  { value: "Ferozepur, Punjab", label: "Ferozepur, Punjab" },
  { value: "Gurdaspur, Punjab", label: "Gurdaspur, Punjab" },
  { value: "Hoshiarpur, Punjab", label: "Hoshiarpur, Punjab" },
  { value: "Jalandhar, Punjab", label: "Jalandhar, Punjab" },
  { value: "Kapurthala, Punjab", label: "Kapurthala, Punjab" },
  { value: "Ludhiana, Punjab", label: "Ludhiana, Punjab" },
  { value: "Mansa, Punjab", label: "Mansa, Punjab" },
  { value: "Moga, Punjab", label: "Moga, Punjab" },
  { value: "Muktsar, Punjab", label: "Muktsar, Punjab" },
  { value: "Nawanshahr, Punjab", label: "Nawanshahr, Punjab" },
  { value: "Pathankot, Punjab", label: "Pathankot, Punjab" },
  { value: "Patiala, Punjab", label: "Patiala, Punjab" },
  { value: "Rupnagar, Punjab", label: "Rupnagar, Punjab" },
  { value: "Sangrur, Punjab", label: "Sangrur, Punjab" },
  { value: "Tarn Taran, Punjab", label: "Tarn Taran, Punjab" },

  // Rajasthan
  { value: "Ajmer, Rajasthan", label: "Ajmer, Rajasthan" },
  { value: "Alwar, Rajasthan", label: "Alwar, Rajasthan" },
  { value: "Banswara, Rajasthan", label: "Banswara, Rajasthan" },
  { value: "Baran, Rajasthan", label: "Baran, Rajasthan" },
  { value: "Barmer, Rajasthan", label: "Barmer, Rajasthan" },
  { value: "Bharatpur, Rajasthan", label: "Bharatpur, Rajasthan" },
  { value: "Bhilwara, Rajasthan", label: "Bhilwara, Rajasthan" },
  { value: "Bikaner, Rajasthan", label: "Bikaner, Rajasthan" },
  { value: "Bundi, Rajasthan", label: "Bundi, Rajasthan" },
  { value: "Chittorgarh, Rajasthan", label: "Chittorgarh, Rajasthan" },
  { value: "Churu, Rajasthan", label: "Churu, Rajasthan" },
  { value: "Dausa, Rajasthan", label: "Dausa, Rajasthan" },
  { value: "Dholpur, Rajasthan", label: "Dholpur, Rajasthan" },
  { value: "Dungarpur, Rajasthan", label: "Dungarpur, Rajasthan" },
  { value: "Hanumangarh, Rajasthan", label: "Hanumangarh, Rajasthan" },
  { value: "Jaipur, Rajasthan", label: "Jaipur, Rajasthan" },
  { value: "Jaisalmer, Rajasthan", label: "Jaisalmer, Rajasthan" },
  { value: "Jalore, Rajasthan", label: "Jalore, Rajasthan" },
  { value: "Jhalawar, Rajasthan", label: "Jhalawar, Rajasthan" },
  { value: "Jhunjhunu, Rajasthan", label: "Jhunjhunu, Rajasthan" },
  { value: "Jodhpur, Rajasthan", label: "Jodhpur, Rajasthan" },
  { value: "Karauli, Rajasthan", label: "Karauli, Rajasthan" },
  { value: "Kota, Rajasthan", label: "Kota, Rajasthan" },
  { value: "Nagaur, Rajasthan", label: "Nagaur, Rajasthan" },
  { value: "Pali, Rajasthan", label: "Pali, Rajasthan" },
  { value: "Pratapgarh, Rajasthan", label: "Pratapgarh, Rajasthan" },
  { value: "Rajsamand, Rajasthan", label: "Rajsamand, Rajasthan" },
  { value: "Sawai Madhopur, Rajasthan", label: "Sawai Madhopur, Rajasthan" },
  { value: "Sikar, Rajasthan", label: "Sikar, Rajasthan" },
  { value: "Sirohi, Rajasthan", label: "Sirohi, Rajasthan" },
  { value: "Sri Ganganagar, Rajasthan", label: "Sri Ganganagar, Rajasthan" },
  { value: "Tonk, Rajasthan", label: "Tonk, Rajasthan" },
  { value: "Udaipur, Rajasthan", label: "Udaipur, Rajasthan" },

  // Sikkim
  { value: "East Sikkim, Sikkim", label: "East Sikkim, Sikkim" },
  { value: "North Sikkim, Sikkim", label: "North Sikkim, Sikkim" },
  { value: "South Sikkim, Sikkim", label: "South Sikkim, Sikkim" },
  { value: "West Sikkim, Sikkim", label: "West Sikkim, Sikkim" },

  // Tamil Nadu
  { value: "Ariyalur, Tamil Nadu", label: "Ariyalur, Tamil Nadu" },
  { value: "Chengalpattu, Tamil Nadu", label: "Chengalpattu, Tamil Nadu" },
  { value: "Chennai, Tamil Nadu", label: "Chennai, Tamil Nadu" },
  { value: "Coimbatore, Tamil Nadu", label: "Coimbatore, Tamil Nadu" },
  { value: "Cuddalore, Tamil Nadu", label: "Cuddalore, Tamil Nadu" },
  { value: "Dharmapuri, Tamil Nadu", label: "Dharmapuri, Tamil Nadu" },
  { value: "Dindigul, Tamil Nadu", label: "Dindigul, Tamil Nadu" },
  { value: "Erode, Tamil Nadu", label: "Erode, Tamil Nadu" },
  { value: "Kallakurichi, Tamil Nadu", label: "Kallakurichi, Tamil Nadu" },
  { value: "Kanchipuram, Tamil Nadu", label: "Kanchipuram, Tamil Nadu" },
  { value: "Kanyakumari, Tamil Nadu", label: "Kanyakumari, Tamil Nadu" },
  { value: "Karur, Tamil Nadu", label: "Karur, Tamil Nadu" },
  { value: "Krishnagiri, Tamil Nadu", label: "Krishnagiri, Tamil Nadu" },
  { value: "Madurai, Tamil Nadu", label: "Madurai, Tamil Nadu" },
  { value: "Mayiladuthurai, Tamil Nadu", label: "Mayiladuthurai, Tamil Nadu" },
  { value: "Nagapattinam, Tamil Nadu", label: "Nagapattinam, Tamil Nadu" },
  { value: "Namakkal, Tamil Nadu", label: "Namakkal, Tamil Nadu" },
  { value: "Nilgiris, Tamil Nadu", label: "Nilgiris, Tamil Nadu" },
  { value: "Perambalur, Tamil Nadu", label: "Perambalur, Tamil Nadu" },
  { value: "Pudukkottai, Tamil Nadu", label: "Pudukkottai, Tamil Nadu" },
  { value: "Ramanathapuram, Tamil Nadu", label: "Ramanathapuram, Tamil Nadu" },
  { value: "Ranipet, Tamil Nadu", label: "Ranipet, Tamil Nadu" },
  { value: "Salem, Tamil Nadu", label: "Salem, Tamil Nadu" },
  { value: "Sivaganga, Tamil Nadu", label: "Sivaganga, Tamil Nadu" },
  { value: "Tenkasi, Tamil Nadu", label: "Tenkasi, Tamil Nadu" },
  { value: "Thanjavur, Tamil Nadu", label: "Thanjavur, Tamil Nadu" },
  { value: "Theni, Tamil Nadu", label: "Theni, Tamil Nadu" },
  { value: "Thoothukudi, Tamil Nadu", label: "Thoothukudi, Tamil Nadu" },
  { value: "Tiruchirappalli, Tamil Nadu", label: "Tiruchirappalli, Tamil Nadu" },
  { value: "Tirunelveli, Tamil Nadu", label: "Tirunelveli, Tamil Nadu" },
  { value: "Tirupathur, Tamil Nadu", label: "Tirupathur, Tamil Nadu" },
  { value: "Tiruppur, Tamil Nadu", label: "Tiruppur, Tamil Nadu" },
  { value: "Tiruvallur, Tamil Nadu", label: "Tiruvallur, Tamil Nadu" },
  { value: "Tiruvannamalai, Tamil Nadu", label: "Tiruvannamalai, Tamil Nadu" },
  { value: "Tiruvarur, Tamil Nadu", label: "Tiruvarur, Tamil Nadu" },
  { value: "Vellore, Tamil Nadu", label: "Vellore, Tamil Nadu" },
  { value: "Viluppuram, Tamil Nadu", label: "Viluppuram, Tamil Nadu" },
  { value: "Virudhunagar, Tamil Nadu", label: "Virudhunagar, Tamil Nadu" },

  // Telangana (Complete)
  { value: "Adilabad, Telangana", label: "Adilabad, Telangana" },
  { value: "Bhadradri Kothagudem, Telangana", label: "Bhadradri Kothagudem, Telangana" },
  { value: "Hyderabad, Telangana", label: "Hyderabad, Telangana" },
  { value: "Jagtial, Telangana", label: "Jagtial, Telangana" },
  { value: "Jangaon, Telangana", label: "Jangaon, Telangana" },
  { value: "Jayashankar Bhupalpally, Telangana", label: "Jayashankar Bhupalpally, Telangana" },
  { value: "Jogulamba Gadwal, Telangana", label: "Jogulamba Gadwal, Telangana" },
  { value: "Kamareddy, Telangana", label: "Kamareddy, Telangana" },
  { value: "Karimnagar, Telangana", label: "Karimnagar, Telangana" },
  { value: "Khammam, Telangana", label: "Khammam, Telangana" },
  { value: "Komaram Bheem Asifabad, Telangana", label: "Komaram Bheem Asifabad, Telangana" },
  { value: "Mahabubabad, Telangana", label: "Mahabubabad, Telangana" },
  { value: "Mahabubnagar, Telangana", label: "Mahabubnagar, Telangana" },
  { value: "Mancherial, Telangana", label: "Mancherial, Telangana" },
  { value: "Medak, Telangana", label: "Medak, Telangana" },
  { value: "Medchal Malkajgiri, Telangana", label: "Medchal Malkajgiri, Telangana" },
  { value: "Mulugu, Telangana", label: "Mulugu, Telangana" },
  { value: "Nagarkurnool, Telangana", label: "Nagarkurnool, Telangana" },
  { value: "Nalgonda, Telangana", label: "Nalgonda, Telangana" },
  { value: "Narayanpet, Telangana", label: "Narayanpet, Telangana" },
  { value: "Nirmal, Telangana", label: "Nirmal, Telangana" },
  { value: "Nizamabad, Telangana", label: "Nizamabad, Telangana" },
  { value: "Peddapalli, Telangana", label: "Peddapalli, Telangana" },
  { value: "Rajanna Sircilla, Telangana", label: "Rajanna Sircilla, Telangana" },
  { value: "Rangareddy, Telangana", label: "Rangareddy, Telangana" },
  { value: "Sangareddy, Telangana", label: "Sangareddy, Telangana" },
  { value: "Siddipet, Telangana", label: "Siddipet, Telangana" },
  { value: "Suryapet, Telangana", label: "Suryapet, Telangana" },
  { value: "Vikarabad, Telangana", label: "Vikarabad, Telangana" },
  { value: "Wanaparthy, Telangana", label: "Wanaparthy, Telangana" },
  { value: "Warangal Rural, Telangana", label: "Warangal Rural, Telangana" },
  { value: "Warangal Urban, Telangana", label: "Warangal Urban, Telangana" },
  { value: "Yadadri Bhuvanagiri, Telangana", label: "Yadadri Bhuvanagiri, Telangana" },

  // Tripura
  { value: "Dhalai, Tripura", label: "Dhalai, Tripura" },
  { value: "Gomati, Tripura", label: "Gomati, Tripura" },
  { value: "Khowai, Tripura", label: "Khowai, Tripura" },
  { value: "North Tripura, Tripura", label: "North Tripura, Tripura" },
  { value: "Sepahijala, Tripura", label: "Sepahijala, Tripura" },
  { value: "South Tripura, Tripura", label: "South Tripura, Tripura" },
  { value: "Unakoti, Tripura", label: "Unakoti, Tripura" },
  { value: "West Tripura, Tripura", label: "West Tripura, Tripura" },

  // Uttar Pradesh
  { value: "Agra, Uttar Pradesh", label: "Agra, Uttar Pradesh" },
  { value: "Aligarh, Uttar Pradesh", label: "Aligarh, Uttar Pradesh" },
  { value: "Ambedkar Nagar, Uttar Pradesh", label: "Ambedkar Nagar, Uttar Pradesh" },
  { value: "Amethi, Uttar Pradesh", label: "Amethi, Uttar Pradesh" },
  { value: "Amroha, Uttar Pradesh", label: "Amroha, Uttar Pradesh" },
  { value: "Auraiya, Uttar Pradesh", label: "Auraiya, Uttar Pradesh" },
  { value: "Ayodhya, Uttar Pradesh", label: "Ayodhya, Uttar Pradesh" },
  { value: "Azamgarh, Uttar Pradesh", label: "Azamgarh, Uttar Pradesh" },
  { value: "Baghpat, Uttar Pradesh", label: "Baghpat, Uttar Pradesh" },
  { value: "Bahraich, Uttar Pradesh", label: "Bahraich, Uttar Pradesh" },
  { value: "Ballia, Uttar Pradesh", label: "Ballia, Uttar Pradesh" },
  { value: "Balrampur, Uttar Pradesh", label: "Balrampur, Uttar Pradesh" },
  { value: "Banda, Uttar Pradesh", label: "Banda, Uttar Pradesh" },
  { value: "Barabanki, Uttar Pradesh", label: "Barabanki, Uttar Pradesh" },
  { value: "Bareilly, Uttar Pradesh", label: "Bareilly, Uttar Pradesh" },
  { value: "Basti, Uttar Pradesh", label: "Basti, Uttar Pradesh" },
  { value: "Bhadohi, Uttar Pradesh", label: "Bhadohi, Uttar Pradesh" },
  { value: "Bijnor, Uttar Pradesh", label: "Bijnor, Uttar Pradesh" },
  { value: "Budaun, Uttar Pradesh", label: "Budaun, Uttar Pradesh" },
  { value: "Bulandshahr, Uttar Pradesh", label: "Bulandshahr, Uttar Pradesh" },
  { value: "Chandauli, Uttar Pradesh", label: "Chandauli, Uttar Pradesh" },
  { value: "Chitrakoot, Uttar Pradesh", label: "Chitrakoot, Uttar Pradesh" },
  { value: "Deoria, Uttar Pradesh", label: "Deoria, Uttar Pradesh" },
  { value: "Etah, Uttar Pradesh", label: "Etah, Uttar Pradesh" },
  { value: "Etawah, Uttar Pradesh", label: "Etawah, Uttar Pradesh" },
  { value: "Farrukhabad, Uttar Pradesh", label: "Farrukhabad, Uttar Pradesh" },
  { value: "Fatehpur, Uttar Pradesh", label: "Fatehpur, Uttar Pradesh" },
  { value: "Firozabad, Uttar Pradesh", label: "Firozabad, Uttar Pradesh" },
  { value: "Gautam Buddha Nagar, Uttar Pradesh", label: "Gautam Buddha Nagar, Uttar Pradesh" },
  { value: "Ghaziabad, Uttar Pradesh", label: "Ghaziabad, Uttar Pradesh" },
  { value: "Ghazipur, Uttar Pradesh", label: "Ghazipur, Uttar Pradesh" },
  { value: "Gonda, Uttar Pradesh", label: "Gonda, Uttar Pradesh" },
  { value: "Gorakhpur, Uttar Pradesh", label: "Gorakhpur, Uttar Pradesh" },
  { value: "Hamirpur, Uttar Pradesh", label: "Hamirpur, Uttar Pradesh" },
  { value: "Hapur, Uttar Pradesh", label: "Hapur, Uttar Pradesh" },
  { value: "Hardoi, Uttar Pradesh", label: "Hardoi, Uttar Pradesh" },
  { value: "Hathras, Uttar Pradesh", label: "Hathras, Uttar Pradesh" },
  { value: "Jalaun, Uttar Pradesh", label: "Jalaun, Uttar Pradesh" },
  { value: "Jaunpur, Uttar Pradesh", label: "Jaunpur, Uttar Pradesh" },
  { value: "Jhansi, Uttar Pradesh", label: "Jhansi, Uttar Pradesh" },
  { value: "Kannauj, Uttar Pradesh", label: "Kannauj, Uttar Pradesh" },
  { value: "Kanpur Dehat, Uttar Pradesh", label: "Kanpur Dehat, Uttar Pradesh" },
  { value: "Kanpur Nagar, Uttar Pradesh", label: "Kanpur Nagar, Uttar Pradesh" },
  { value: "Kasganj, Uttar Pradesh", label: "Kasganj, Uttar Pradesh" },
  { value: "Kaushambi, Uttar Pradesh", label: "Kaushambi, Uttar Pradesh" },
  { value: "Kheri, Uttar Pradesh", label: "Kheri, Uttar Pradesh" },
  { value: "Kushinagar, Uttar Pradesh", label: "Kushinagar, Uttar Pradesh" },
  { value: "Lalitpur, Uttar Pradesh", label: "Lalitpur, Uttar Pradesh" },
  { value: "Lucknow, Uttar Pradesh", label: "Lucknow, Uttar Pradesh" },
  { value: "Maharajganj, Uttar Pradesh", label: "Maharajganj, Uttar Pradesh" },
  { value: "Mahoba, Uttar Pradesh", label: "Mahoba, Uttar Pradesh" },
  { value: "Mainpuri, Uttar Pradesh", label: "Mainpuri, Uttar Pradesh" },
  { value: "Mathura, Uttar Pradesh", label: "Mathura, Uttar Pradesh" },
  { value: "Mau, Uttar Pradesh", label: "Mau, Uttar Pradesh" },
  { value: "Meerut, Uttar Pradesh", label: "Meerut, Uttar Pradesh" },
  { value: "Mirzapur, Uttar Pradesh", label: "Mirzapur, Uttar Pradesh" },
  { value: "Moradabad, Uttar Pradesh", label: "Moradabad, Uttar Pradesh" },
  { value: "Muzaffarnagar, Uttar Pradesh", label: "Muzaffarnagar, Uttar Pradesh" },
  { value: "Pilibhit, Uttar Pradesh", label: "Pilibhit, Uttar Pradesh" },
  { value: "Pratapgarh, Uttar Pradesh", label: "Pratapgarh, Uttar Pradesh" },
  { value: "Prayagraj, Uttar Pradesh", label: "Prayagraj, Uttar Pradesh" },
  { value: "Raebareli, Uttar Pradesh", label: "Raebareli, Uttar Pradesh" },
  { value: "Rampur, Uttar Pradesh", label: "Rampur, Uttar Pradesh" },
  { value: "Saharanpur, Uttar Pradesh", label: "Saharanpur, Uttar Pradesh" },
  { value: "Sambhal, Uttar Pradesh", label: "Sambhal, Uttar Pradesh" },
  { value: "Sant Kabir Nagar, Uttar Pradesh", label: "Sant Kabir Nagar, Uttar Pradesh" },
  { value: "Shahjahanpur, Uttar Pradesh", label: "Shahjahanpur, Uttar Pradesh" },
  { value: "Shamli, Uttar Pradesh", label: "Shamli, Uttar Pradesh" },
  { value: "Shrawasti, Uttar Pradesh", label: "Shrawasti, Uttar Pradesh" },
  { value: "Siddharthnagar, Uttar Pradesh", label: "Siddharthnagar, Uttar Pradesh" },
  { value: "Sitapur, Uttar Pradesh", label: "Sitapur, Uttar Pradesh" },
  { value: "Sonbhadra, Uttar Pradesh", label: "Sonbhadra, Uttar Pradesh" },
  { value: "Sultanpur, Uttar Pradesh", label: "Sultanpur, Uttar Pradesh" },
  { value: "Unnao, Uttar Pradesh", label: "Unnao, Uttar Pradesh" },
  { value: "Varanasi, Uttar Pradesh", label: "Varanasi, Uttar Pradesh" },

  // Uttarakhand
  { value: "Almora, Uttarakhand", label: "Almora, Uttarakhand" },
  { value: "Bageshwar, Uttarakhand", label: "Bageshwar, Uttarakhand" },
  { value: "Chamoli, Uttarakhand", label: "Chamoli, Uttarakhand" },
  { value: "Champawat, Uttarakhand", label: "Champawat, Uttarakhand" },
  { value: "Dehradun, Uttarakhand", label: "Dehradun, Uttarakhand" },
  { value: "Haridwar, Uttarakhand", label: "Haridwar, Uttarakhand" },
  { value: "Nainital, Uttarakhand", label: "Nainital, Uttarakhand" },
  { value: "Pauri Garhwal, Uttarakhand", label: "Pauri Garhwal, Uttarakhand" },
  { value: "Pithoragarh, Uttarakhand", label: "Pithoragarh, Uttarakhand" },
  { value: "Rudraprayag, Uttarakhand", label: "Rudraprayag, Uttarakhand" },
  { value: "Tehri Garhwal, Uttarakhand", label: "Tehri Garhwal, Uttarakhand" },
  { value: "Udham Singh Nagar, Uttarakhand", label: "Udham Singh Nagar, Uttarakhand" },
  { value: "Uttarkashi, Uttarakhand", label: "Uttarkashi, Uttarakhand" },

  // West Bengal
  { value: "Alipurduar, West Bengal", label: "Alipurduar, West Bengal" },
  { value: "Bankura, West Bengal", label: "Bankura, West Bengal" },
  { value: "Birbhum, West Bengal", label: "Birbhum, West Bengal" },
  { value: "Cooch Behar, West Bengal", label: "Cooch Behar, West Bengal" },
  { value: "Dakshin Dinajpur, West Bengal", label: "Dakshin Dinajpur, West Bengal" },
  { value: "Darjeeling, West Bengal", label: "Darjeeling, West Bengal" },
  { value: "Hooghly, West Bengal", label: "Hooghly, West Bengal" },
  { value: "Howrah, West Bengal", label: "Howrah, West Bengal" },
  { value: "Jalpaiguri, West Bengal", label: "Jalpaiguri, West Bengal" },
  { value: "Jhargram, West Bengal", label: "Jhargram, West Bengal" },
  { value: "Kalimpong, West Bengal", label: "Kalimpong, West Bengal" },
  { value: "Kolkata, West Bengal", label: "Kolkata, West Bengal" },
  { value: "Malda, West Bengal", label: "Malda, West Bengal" },
  { value: "Murshidabad, West Bengal", label: "Murshidabad, West Bengal" },
  { value: "Nadia, West Bengal", label: "Nadia, West Bengal" },
  { value: "North 24 Parganas, West Bengal", label: "North 24 Parganas, West Bengal" },
  { value: "Paschim Bardhaman, West Bengal", label: "Paschim Bardhaman, West Bengal" },
  { value: "Paschim Medinipur, West Bengal", label: "Paschim Medinipur, West Bengal" },
  { value: "Purba Bardhaman, West Bengal", label: "Purba Bardhaman, West Bengal" },
  { value: "Purba Medinipur, West Bengal", label: "Purba Medinipur, West Bengal" },
  { value: "Purulia, West Bengal", label: "Purulia, West Bengal" },
  { value: "South 24 Parganas, West Bengal", label: "South 24 Parganas, West Bengal" },
  { value: "Uttar Dinajpur, West Bengal", label: "Uttar Dinajpur, West Bengal" },

  // Union Territories

  // Andaman and Nicobar Islands
  { value: "Nicobar, Andaman and Nicobar Islands", label: "Nicobar, Andaman and Nicobar Islands" },
  { value: "North and Middle Andaman, Andaman and Nicobar Islands", label: "North and Middle Andaman, Andaman and Nicobar Islands" },
  { value: "South Andaman, Andaman and Nicobar Islands", label: "South Andaman, Andaman and Nicobar Islands" },

  // Chandigarh
  { value: "Chandigarh, Chandigarh", label: "Chandigarh, Chandigarh" },

  // Dadra and Nagar Haveli and Daman and Diu
  { value: "Dadra and Nagar Haveli, Dadra and Nagar Haveli and Daman and Diu", label: "Dadra and Nagar Haveli, Dadra and Nagar Haveli and Daman and Diu" },
  { value: "Daman, Dadra and Nagar Haveli and Daman and Diu", label: "Daman, Dadra and Nagar Haveli and Daman and Diu" },
  { value: "Diu, Dadra and Nagar Haveli and Daman and Diu", label: "Diu, Dadra and Nagar Haveli and Daman and Diu" },

  // Delhi
  { value: "Central Delhi, Delhi", label: "Central Delhi, Delhi" },
  { value: "East Delhi, Delhi", label: "East Delhi, Delhi" },
  { value: "New Delhi, Delhi", label: "New Delhi, Delhi" },
  { value: "North Delhi, Delhi", label: "North Delhi, Delhi" },
  { value: "North East Delhi, Delhi", label: "North East Delhi, Delhi" },
  { value: "North West Delhi, Delhi", label: "North West Delhi, Delhi" },
  { value: "Shahdara, Delhi", label: "Shahdara, Delhi" },
  { value: "South Delhi, Delhi", label: "South Delhi, Delhi" },
  { value: "South East Delhi, Delhi", label: "South East Delhi, Delhi" },
  { value: "South West Delhi, Delhi", label: "South West Delhi, Delhi" },
  { value: "West Delhi, Delhi", label: "West Delhi, Delhi" },

  // Jammu and Kashmir
  { value: "Anantnag, Jammu and Kashmir", label: "Anantnag, Jammu and Kashmir" },
  { value: "Bandipora, Jammu and Kashmir", label: "Bandipora, Jammu and Kashmir" },
  { value: "Baramulla, Jammu and Kashmir", label: "Baramulla, Jammu and Kashmir" },
  { value: "Budgam, Jammu and Kashmir", label: "Budgam, Jammu and Kashmir" },
  { value: "Doda, Jammu and Kashmir", label: "Doda, Jammu and Kashmir" },
  { value: "Ganderbal, Jammu and Kashmir", label: "Ganderbal, Jammu and Kashmir" },
  { value: "Jammu, Jammu and Kashmir", label: "Jammu, Jammu and Kashmir" },
  { value: "Kathua, Jammu and Kashmir", label: "Kathua, Jammu and Kashmir" },
  { value: "Kishtwar, Jammu and Kashmir", label: "Kishtwar, Jammu and Kashmir" },
  { value: "Kulgam, Jammu and Kashmir", label: "Kulgam, Jammu and Kashmir" },
  { value: "Kupwara, Jammu and Kashmir", label: "Kupwara, Jammu and Kashmir" },
  { value: "Poonch, Jammu and Kashmir", label: "Poonch, Jammu and Kashmir" },
  { value: "Pulwama, Jammu and Kashmir", label: "Pulwama, Jammu and Kashmir" },
  { value: "Rajouri, Jammu and Kashmir", label: "Rajouri, Jammu and Kashmir" },
  { value: "Ramban, Jammu and Kashmir", label: "Ramban, Jammu and Kashmir" },
  { value: "Reasi, Jammu and Kashmir", label: "Reasi, Jammu and Kashmir" },
  { value: "Samba, Jammu and Kashmir", label: "Samba, Jammu and Kashmir" },
  { value: "Shopian, Jammu and Kashmir", label: "Shopian, Jammu and Kashmir" },
  { value: "Srinagar, Jammu and Kashmir", label: "Srinagar, Jammu and Kashmir" },
  { value: "Udhampur, Jammu and Kashmir", label: "Udhampur, Jammu and Kashmir" },

  // Ladakh
  { value: "Kargil, Ladakh", label: "Kargil, Ladakh" },
  { value: "Leh, Ladakh", label: "Leh, Ladakh" },

  // Lakshadweep
  { value: "Lakshadweep, Lakshadweep", label: "Lakshadweep, Lakshadweep" },

  // Puducherry
  { value: "Karaikal, Puducherry", label: "Karaikal, Puducherry" },
  { value: "Mahe, Puducherry", label: "Mahe, Puducherry" },
  { value: "Puducherry, Puducherry", label: "Puducherry, Puducherry" },
  { value: "Yanam, Puducherry", label: "Yanam, Puducherry" },

]

const BuyerSignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location:'',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate()

  const { user,setUser } = useContext(userContext)
  const { role,setRole } = useContext(roleContext)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if(!formData.location){
      newErrors.location = 'Please select your location'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Contact number is required';
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Enter a valid phone number (10-15 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios.post('http://localhost:8000/consumer/signUp',formData)
      .then(results => {
        toast.success('SignUp Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setUser(results.data.userId)
        setRole('consumer')
        setTimeout(() => {
          navigate('/')
        }, (3000));
      })
      .catch(err =>{
        toast.error((err.response.data.message || 'Failed to SignUp'), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setErrors(err.message)
      })
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full shadow-lg">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join as a Consumer!</h2>
          <p className="text-gray-600">Create your account to explore and purchase fresh produce</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor='location' className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinHouse  className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="location"
                  value={formData.location} 
                  onChange={handleChange} 
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="" disabled hidden>Select a district</option>
                  {indianDistricts.map((ele,idx) => (
                    <option key={idx} value={ele.value}>
                      {ele.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-green-600 hover:text-green-500 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-green-600 hover:text-green-500 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Create Consumer Account
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="#" className="text-green-600 hover:text-green-500 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Why Join as a Consumer?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <span>Browse fresh produce from trusted local farmers</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <span>Enjoy direct pricing without middlemen</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <span>Track your orders with our simple dashboard</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <span>Chat with farmers before placing your order</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerSignUp;