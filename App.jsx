import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hbcdafzqpmikltrenpny.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiY2RhZnpxcG1pa2x0cmVucG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MTY4NTMsImV4cCI6MjA4OTk5Mjg1M30.Tkzm9M63OpIbWExpClWH5ZcpqqyEGXOxyJGlnkeGj0M";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COUNTRIES = ["Afghanistan","Albania","Algeria","Angola","Argentina","Australia","Austria","Azerbaijan","Bangladesh","Belgium","Bolivia","Brazil","Cambodia","Cameroon","Canada","Chile","China","Colombia","Congo","Croatia","Cuba","Czech Republic","Denmark","Ecuador","Egypt","Ethiopia","Finland","France","Germany","Ghana","Greece","Guatemala","Haiti","Honduras","Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Lebanon","Libya","Malaysia","Mexico","Morocco","Mozambique","Myanmar","Nepal","Netherlands","New Zealand","Nicaragua","Nigeria","Norway","Pakistan","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia","Senegal","Serbia","Sierra Leone","Singapore","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tanzania","Thailand","Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];
const HOBBIES = ["music","painting","yoga","surfing","cooking","hiking","reading","dancing","photography","gaming","gym","coding","gardening","baking","running","travel","movies","sports"];
const INTERESTS = ["art","travel","coffee","food","outdoors","tech","wellness","nature","culture","philosophy","fashion","gaming"];
const GENDERS = ["male","female","non-binary","other"];
const ORIENTATIONS = ["straight","gay","lesbian","bisexual","pansexual","other"];
const STATUSES = ["single","divorced","widowed","open relationship"];
const AVATARS = ["😊","🌟","🦋","🌸","🔥","💫","🎯","🌊","🦁","🐺","🦊","🐬","🐸","🦄","🐙","🦅","🌺","🎪","🍀","🎸","👑","💎"];
const DEV = {id:"dev-0",username:"luminar_dev",email:"admin@luminar.com",password:"luminar_dev_2026",age:99,gender:"male",orientation:"straight",location:"Nairobi, Kenya",city:"Nairobi",country:"Kenya",profile_pic:"👑",hobbies:["coding","gaming","travel"],interests:["tech","art","travel"],work:"CEO & Founder @ Luminar",relationship_status:"single",pets:"none",bio:"Built this whole app. Yes I know.",looking_for:"Someone worth building for",isDevAccount:true,online:true,is_premium:true,premium_plan:"Dev Mode"};

function getMatchScore(u1,u2){const c=(u1.interests||[]).filter(i=>(u2.interests||[]).includes(i));return Math.round((c.length/Math.max((u1.interests||[]).length,(u2.interests||[]).length,1))*100);}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Nunito',sans-serif;background:#fff5f8;min-height:100vh;}
.brand{font-family:'Fredoka One',cursive;background:linear-gradient(135deg,#ff6b9d,#c44dff,#4d79ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.card{background:white;border-radius:24px;box-shadow:0 8px 32px rgba(255,107,157,0.12);padding:32px;}
.btn-primary{background:linear-gradient(135deg,#ff6b9d,#c44dff);color:white;border:none;border-radius:50px;padding:14px 32px;font-size:16px;font-weight:700;cursor:pointer;width:100%;transition:all 0.3s;font-family:'Nunito',sans-serif;}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(196,77,255,0.4);}
.btn-secondary{background:transparent;color:#c44dff;border:2px solid #c44dff;border-radius:50px;padding:12px 28px;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.3s;font-family:'Nunito',sans-serif;}
.btn-secondary:hover{background:#c44dff;color:white;}
.input{width:100%;padding:14px 18px;border:2px solid #f0e6ff;border-radius:14px;font-size:15px;font-family:'Nunito',sans-serif;outline:none;transition:border-color 0.3s;background:#fdf8ff;}
.input:focus{border-color:#c44dff;}
.label{font-weight:700;color:#553c7b;margin-bottom:6px;display:block;font-size:14px;}
.field{margin-bottom:20px;}
.chip{display:inline-block;background:linear-gradient(135deg,#ffe0ee,#f0e6ff);color:#8844cc;border-radius:50px;padding:6px 16px;font-size:13px;font-weight:700;margin:4px;cursor:pointer;transition:all 0.2s;border:2px solid transparent;}
.chip.active{background:linear-gradient(135deg,#ff6b9d,#c44dff);color:white;}
.chip:hover{transform:scale(1.05);}
.match-card{background:white;border-radius:20px;padding:20px;box-shadow:0 4px 20px rgba(255,107,157,0.1);border:2px solid #f0e6ff;transition:all 0.3s;margin-bottom:16px;}
.badge{display:inline-block;background:linear-gradient(135deg,#ff6b9d22,#c44dff22);color:#c44dff;border-radius:50px;padding:4px 12px;font-size:12px;font-weight:700;margin:2px;}
.chat-bubble{max-width:70%;padding:12px 18px;border-radius:20px;margin:4px 0;font-size:14px;line-height:1.5;}
.sent{background:linear-gradient(135deg,#ff6b9d,#c44dff);color:white;border-radius:20px 20px 4px 20px;margin-left:auto;}
.received{background:#f5f0ff;color:#553c7b;border-radius:20px 20px 20px 4px;}
.nav{display:flex;background:white;border-top:2px solid #f0e6ff;padding:12px 0 8px;position:fixed;bottom:0;left:0;right:0;justify-content:space-around;z-index:100;}
.nav-btn{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;font-weight:700;color:#bbb;cursor:pointer;transition:all 0.2s;background:none;border:none;font-family:'Nunito',sans-serif;padding:4px 12px;}
.nav-btn.active{color:#c44dff;}
.section-title{font-family:'Fredoka One',cursive;font-size:22px;color:#553c7b;margin-bottom:16px;}
.progress-bar{height:6px;background:#f0e6ff;border-radius:50px;overflow:hidden;}
.progress-fill{height:100%;background:linear-gradient(135deg,#ff6b9d,#c44dff);border-radius:50px;transition:width 0.5s;}
`;
function Splash({ onDone }) {
  const [animated, setAnimated] = useState(false);
  const [tagline, setTagline] = useState(false);
  const [fade, setFade] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimated(true), 200);
    setTimeout(() => setTagline(true), 1100);
    setTimeout(() => setFade(true), 2800);
    setTimeout(() => onDone(), 3400);
  }, []);
  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"#050d1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:fade?0:1,transition:"opacity 0.6s ease"}}>
      <div style={{width:160,height:160,marginBottom:28,opacity:animated?1:0,transform:animated?"scale(1)":"scale(0.7)",transition:"all 1.2s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <svg width="160" height="160" viewBox="0 0 220 220" fill="none">
          <defs>
            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00c8e0"/><stop offset="100%" stopColor="#0077b6"/></linearGradient>
            <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#48cae4"/><stop offset="100%" stopColor="#0096c7"/></linearGradient>
            <linearGradient id="g3" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stopColor="#90e0ef"/><stop offset="100%" stopColor="#00b4d8"/></linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="4" result="cb"/><feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <path d="M 60 140 C 40 100, 60 60, 100 55 C 120 52, 135 62, 140 80" stroke="url(#g1)" strokeWidth="3.5" fill="none" strokeLinecap="round" filter="url(#glow)" style={{strokeDasharray:200,strokeDashoffset:animated?0:200,transition:"stroke-dashoffset 1.4s ease 0.3s"}}/>
          <path d="M 160 80 C 180 120, 160 160, 120 165 C 100 168, 85 158, 80 140" stroke="url(#g2)" strokeWidth="3.5" fill="none" strokeLinecap="round" filter="url(#glow)" style={{strokeDasharray:200,strokeDashoffset:animated?0:200,transition:"stroke-dashoffset 1.4s ease 0.5s"}}/>
          <path d="M 140 80 C 145 95, 130 108, 110 110 C 90 112, 75 125, 80 140" stroke="url(#g3)" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#glow)" style={{strokeDasharray:120,strokeDashoffset:animated?0:120,transition:"stroke-dashoffset 1s ease 0.9s"}}/>
          <circle cx="140" cy="80" r="5" fill="#00e5ff" filter="url(#glow)" style={{opacity:animated?1:0,transition:"opacity 0.5s ease 1.2s"}}/>
          <circle cx="80" cy="140" r="5" fill="#00e5ff" filter="url(#glow)" style={{opacity:animated?1:0,transition:"opacity 0.5s ease 1.3s"}}/>
          <circle cx="110" cy="110" r="7" fill="#90e0ef" filter="url(#glow)" style={{opacity:animated?1:0,transition:"opacity 0.5s ease 1.4s"}}/>
        </svg>
      </div>
      <div style={{textAlign:"center",opacity:animated?1:0,transform:animated?"translateY(0)":"translateY(20px)",transition:"all 0.8s ease 0.8s"}}>
        <div style={{fontSize:44,fontWeight:300,letterSpacing:"0.25em",background:"linear-gradient(135deg,#90e0ef,#00c8e0,#0096c7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",fontFamily:"Georgia,serif",textTransform:"uppercase"}}>Luminar</div>
        <div style={{width:tagline?160:0,height:1,background:"linear-gradient(90deg,transparent,#00c8e0,transparent)",margin:"10px auto",transition:"width 0.8s ease"}}/>
        <div style={{opacity:tagline?1:0,fontSize:11,letterSpacing:"0.35em",color:"#48cae4",textTransform:"uppercase",fontFamily:"Georgia,serif",fontWeight:300,transition:"all 0.8s ease"}}>Where your light finds another</div>
      </div>
    </div>
  );
}

function DOBPicker({ onChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const [selMonth, setSelMonth] = useState(0);
  const [selDay, setSelDay] = useState(1);
  const [selYear, setSelYear] = useState(2000);
  useEffect(() => {
    const mm = String(selMonth + 1).padStart(2, "0");
    const dd = String(selDay).padStart(2, "0");
    onChange(`${selYear}-${mm}-${dd}`);
  }, [selMonth, selDay, selYear]);
  const sel = {flex:1,padding:"12px 8px",border:"2px solid #f0e6ff",borderRadius:14,fontSize:15,fontFamily:"'Nunito',sans-serif",outline:"none",background:"#fdf8ff",color:"#553c7b",fontWeight:700,appearance:"none",WebkitAppearance:"none",textAlign:"center",cursor:"pointer"};
  return (
    <div style={{background:"#fdf8ff",borderRadius:16,padding:16,border:"2px solid #f0e6ff"}}>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <div style={{fontSize:11,fontWeight:800,color:"#a089c0",letterSpacing:"0.1em",textTransform:"uppercase"}}>Month</div>
          <select style={sel} value={selMonth} onChange={e => setSelMonth(parseInt(e.target.value))}>
            {MONTHS.map((m,i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <div style={{fontSize:11,fontWeight:800,color:"#a089c0",letterSpacing:"0.1em",textTransform:"uppercase"}}>Day</div>
          <select style={sel} value={selDay} onChange={e => setSelDay(parseInt(e.target.value))}>
            {days.map(d => <option key={d} value={d}>{String(d).padStart(2,"0")}</option>)}
          </select>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <div style={{fontSize:11,fontWeight:800,color:"#a089c0",letterSpacing:"0.1em",textTransform:"uppercase"}}>Year</div>
          <select style={sel} value={selYear} onChange={e => setSelYear(parseInt(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div style={{textAlign:"center",marginTop:12,fontSize:13,fontWeight:700,color:"#a089c0"}}>
        🎂 {MONTHS[selMonth]} {String(selDay).padStart(2,"0")}, {selYear}
      </div>
    </div>
  );
}export default function App() {
  const [splash, setSplash] = useState(true);
  const [screen, setScreen] = useState("signup");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState("scout");
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState({});
  const [chatInput, setChatInput] = useState("");
  const [revealed, setRevealed] = useState({});
  const [likes, setLikes] = useState([]);
  const [boostActive, setBoostActive] = useState(false);
  const [boostTime, setBoostTime] = useState(0);
  const boostTimer = useRef(null);
  const [incognito, setIncognito] = useState(false);
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(50);
  const [notif, setNotif] = useState(null);
  const [showTC, setShowTC] = useState(false);
  const [agreedTC, setAgreedTC] = useState(false);
  const [showCare, setShowCare] = useState(false);
  const [careTopic, setCareTopic] = useState("");
  const [careMsg, setCareMsg] = useState("");
  const [careSent, setCareSent] = useState(false);
  const [showDots, setShowDots] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [setupStep, setSetupStep] = useState(0);
  const [signupData, setSignupData] = useState({email:"",username:"",password:"",confirm:"",dob:""});
  const [profile, setProfile] = useState({profilePic:"😊",username:"",location:"",country:"",city:"",hobbies:[],work:"",relationshipStatus:"",interests:[],pets:"",bio:"",lookingFor:"",gender:"",orientation:"",lookingForGender:""});
  const msgSub = useRef(null);

  const showNotif = (msg, type="success") => { setNotif({msg,type}); setTimeout(() => setNotif(null), 3000); };
  const ts = () => new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session) loadUserProfile(session.user);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      if (session) loadUserProfile(session.user);
      else { setCurrentUser(null); setScreen("signup"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user) => {
    const { data } = await sb.from("profiles").select("*").eq("id", user.id).single();
    if (data) {
      setCurrentUser(data);
      setIsPremium(data.is_premium ? {plan:data.premium_plan,price:""} : false);
      await sb.from("profiles").update({online:true}).eq("id", user.id);
      setScreen("main");
      loadAllUsers(user.id);
      loadLikes(user.id);
      subscribeToMessages(user.id);
    } else {
      setScreen("setup");
    }
  };

  const loadAllUsers = async (myId) => {
    const { data } = await sb.from("profiles").select("*").neq("id", myId);
    if (data) setAllUsers(data);
  };

  const loadLikes = async (myId) => {
    const { data } = await sb.from("likes").select("liker_id, profiles!liker_id(*)").eq("liked_id", myId);
    if (data) setLikes(data.map(l => l.profiles).filter(Boolean));
  };

  const subscribeToMessages = (myId) => {
    if (msgSub.current) msgSub.current.unsubscribe();
    msgSub.current = sb.channel("messages").on("postgres_changes", {event:"INSERT",schema:"public",table:"messages",filter:`receiver_id=eq.${myId}`}, payload => {
      const msg = payload.new;
      setChats(p => ({...p,[msg.sender_id]:[...(p[msg.sender_id]||[]),{...msg,from:msg.sender_id,time:ts()}]}));
    }).subscribe();
  };

  const handleSignup = async () => {
    if (!signupData.email || !signupData.username) return showNotif("Fill in all fields!", "error");
    if (!signupData.dob) return showNotif("Enter your date of birth!", "error");
    const dob = new Date(signupData.dob + "T00:00:00");
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;
    if (age < 18) return showNotif("You must be 18 or older!", "error");
    if (!signupData.password) return showNotif("Enter a password!", "error");
    if (signupData.password.length < 6) return showNotif("Password must be 6+ characters!", "error");
    if (signupData.password !== signupData.confirm) return showNotif("Passwords do not match!", "error");
    if (!agreedTC) return showNotif("Please agree to Terms and Conditions!", "error");
    const { data: existing } = await sb.from("profiles").select("username").eq("username", signupData.username).single();
    if (existing) return showNotif("Username taken! Try another", "error");
    setLoading(true);
    const { error } = await sb.auth.signUp({email:signupData.email, password:signupData.password});
    setLoading(false);
    if (error) return showNotif(error.message, "error");
    setScreen("setup");
  };

  const handleLogin = async () => {
    if (signupData.email === DEV.email && signupData.password === DEV.password) {
      setCurrentUser(DEV);
      setIsPremium({plan:"Dev Mode",price:"FREE"});
      loadAllUsers("dev-0");
      setScreen("main");
      showNotif("Welcome back CEO! God mode activated!");
      return;
    }
    setLoading(true);
    const { error } = await sb.auth.signInWithPassword({email:signupData.email, password:signupData.password});
    setLoading(false);
    if (error) return showNotif("Invalid credentials!", "error");
  };

  const handleLogout = async () => {
    if (currentUser && !currentUser.isDevAccount) {
      await sb.from("profiles").update({online:false}).eq("id", currentUser.id);
      await sb.auth.signOut();
    }
    setCurrentUser(null); setScreen("signup"); setShowDots(false); showNotif("Logged out!");
  };

  const finishSetup = async () => {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return showNotif("Session expired, please login again", "error");
    const dob = new Date(signupData.dob + "T00:00:00");
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;
    setLoading(true);
    const { error } = await sb.from("profiles").insert({
      id:user.id, email:signupData.email, username:signupData.username, age,
      profile_pic:profile.profilePic, location:profile.location, country:profile.country, city:profile.city,
      gender:profile.gender, orientation:profile.orientation, looking_for_gender:profile.lookingForGender,
      hobbies:profile.hobbies, interests:profile.interests, work:profile.work,
      relationship_status:profile.relationshipStatus, pets:profile.pets, bio:profile.bio,
      looking_for:profile.lookingFor, online:true,
    });
    setLoading(false);
    if (error) return showNotif("Error saving profile: " + error.message, "error");
    await loadUserProfile(user);
    showNotif("Profile created! Time to find your match!");
  };

  const saveProfile = async () => {
    if (!currentUser?.isDevAccount) {
      setLoading(true);
      await sb.from("profiles").update({
        username:editData.username, profile_pic:editData.profile_pic||editData.profilePic,
        location:editData.location, country:editData.country, city:editData.city,
        work:editData.work, pets:editData.pets, relationship_status:editData.relationship_status||editData.relationshipStatus,
        hobbies:editData.hobbies, interests:editData.interests, bio:editData.bio, looking_for:editData.looking_for||editData.lookingFor,
      }).eq("id", currentUser.id);
      setLoading(false);
    }
    setCurrentUser({...currentUser,...editData}); setEditMode(false); showNotif("Profile updated!");
  };

  const startChat = async (user) => {
    setActiveChat(user); setActiveTab("chats");
    if (currentUser.isDevAccount) {
      if (!chats[user.id]) setChats(p => ({...p,[user.id]:[{from:user.id,text:`Hey! I am ${user.username}! How are you?`,time:ts(),status:"read"}]}));
      return;
    }
    const { data } = await sb.from("messages").select("*").or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`).order("created_at");
    if (data) {
      const msgs = data.map(m => ({...m,from:m.sender_id===currentUser.id?"me":m.sender_id,time:new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}));
      setChats(p => ({...p,[user.id]:msgs}));
      await sb.from("messages").update({status:"read"}).eq("sender_id",user.id).eq("receiver_id",currentUser.id);
    }
  };

  const sendMsg = async () => {
    if (!chatInput.trim() || !activeChat) return;
    const text = chatInput; setChatInput("");
    const msg = {from:"me",text,time:ts(),status:"sent"};
    setChats(p => ({...p,[activeChat.id]:[...(p[activeChat.id]||[]),msg]}));
    if (currentUser.isDevAccount) {
      setTimeout(() => {
        const replies = ["That is so interesting! Tell me more","Haha you are funny!","Really? I love that too!","Omg same!!","You seem really cool","I would love to know more about you"];
        const reply = {from:activeChat.id,text:replies[Math.floor(Math.random()*replies.length)],time:ts(),status:"read"};
        setChats(p => ({...p,[activeChat.id]:[...(p[activeChat.id]||[]).map(m=>m.from==="me"?{...m,status:"read"}:m),reply]}));
      }, 1200);
      return;
    }
    await sb.from("messages").insert({sender_id:currentUser.id,receiver_id:activeChat.id,text,status:"sent"});
  };

  const likeUser = async (userId) => {
    if (currentUser.isDevAccount) return showNotif("Liked! (Dev mode)");
    await sb.from("likes").insert({liker_id:currentUser.id,liked_id:userId});
    showNotif("Liked! 💜");
  };

  const getReveal = (uid) => revealed[uid] || {iShared:false,theyShared:false};

  const shareMyPic = async (uid) => {
    setRevealed(p => ({...p,[uid]:{...getReveal(uid),iShared:true}}));
    showNotif("Your pic is now visible to them!");
    if (!currentUser.isDevAccount) await sb.from("pic_reveals").insert({sharer_id:currentUser.id,receiver_id:uid});
    if (!getReveal(uid).theyShared && Math.random() > 0.4) {
      setTimeout(() => { setRevealed(p => ({...p,[uid]:{...(p[uid]||{}),iShared:true,theyShared:true}})); showNotif("They shared their pic with you too!"); }, 3000+Math.random()*4000);
    }
  };

  const activateBoost = () => {
    if (!isPremium) { setActiveTab("premium"); return; }
    if (boostActive) return showNotif("Boost already active!", "error");
    setBoostActive(true); setBoostTime(3600); showNotif("Boost activated! You are at the top for 1 hour!");
    if (boostTimer.current) clearInterval(boostTimer.current);
    boostTimer.current = setInterval(() => {
      setBoostTime(p => { if(p<=1){clearInterval(boostTimer.current);setBoostActive(false);showNotif("Boost expired!");return 0;} return p-1;});
    }, 1000);
  };
  const fmtBoost = (s) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  const toggleArr = (key, val, data, setter) => {
    const arr = data[key] || [];
    setter(p => ({...p,[key]:arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]}));
  };

  const isCompat = (u) => {
    if (u.id === currentUser?.id) return false;
    if (currentUser?.isDevAccount) return true;
    if (incognito) return true;
    if (u.age < ageMin || u.age > ageMax) return false;
    if (currentUser?.orientation === "straight") {
      if (currentUser?.gender === "male") return u.gender === "female";
      if (currentUser?.gender === "female") return u.gender === "male";
    }
    if (currentUser?.looking_for_gender && currentUser?.looking_for_gender !== "everyone") return u.gender === currentUser.looking_for_gender;
    return true;
  };

  const getMatches = () => {
    const results = allUsers.filter(isCompat).map(u => ({...u,score:getMatchScore({interests:currentUser?.interests||[]},{interests:u.interests||[]})})).sort((a,b)=>b.score-a.score);
    if (boostActive) return [{...currentUser,score:100,isBoosted:true},...results];
    return results;
  };
const SETUP_STEPS = [
    { title: "Pick your avatar! 🎭", content: (
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {AVATARS.map(e => <div key={e} onClick={() => setProfile(p=>({...p,profilePic:e}))} style={{fontSize:28,padding:10,borderRadius:12,cursor:"pointer",border:profile.profilePic===e?"3px solid #c44dff":"3px solid #f0e6ff",background:profile.profilePic===e?"#f5f0ff":"white",width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</div>)}
      </div>
    )},
    { title: "Where are you? 📍", content: (
      <div>
        <div className="field"><label className="label">Country 🌍</label>
          <select className="input" value={profile.country||""} onChange={e => setProfile(p=>({...p,country:e.target.value,location:p.city?`${p.city}, ${e.target.value}`:e.target.value}))} style={{cursor:"pointer"}}>
            <option value="">Select your country...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field"><label className="label">City 🏙️</label>
          <input className="input" placeholder="Enter your city..." value={profile.city||""} onChange={e => setProfile(p=>({...p,city:e.target.value,location:p.country?`${e.target.value}, ${p.country}`:e.target.value}))}/>
        </div>
        {profile.location && <div style={{background:"#f5f0ff",borderRadius:12,padding:12,fontSize:13,color:"#8866bb",fontWeight:700}}>📍 {profile.location}</div>}
      </div>
    )},
    { title: "Tell us about you! ✨", content: (
      <div>
        <div className="field"><label className="label">I identify as</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{GENDERS.map(g => <div key={g} className={`chip ${profile.gender===g?"active":""}`} onClick={() => setProfile(p=>({...p,gender:g}))}>{g}</div>)}</div></div>
        <div className="field"><label className="label">My orientation</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{ORIENTATIONS.map(o => <div key={o} className={`chip ${profile.orientation===o?"active":""}`} onClick={() => setProfile(p=>({...p,orientation:o}))}>{o}</div>)}</div></div>
        <div className="field"><label className="label">Work</label><input className="input" placeholder="What do you do?" value={profile.work} onChange={e => setProfile(p=>({...p,work:e.target.value}))}/></div>
        <div className="field"><label className="label">Relationship status</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{STATUSES.map(r => <div key={r} className={`chip ${profile.relationshipStatus===r?"active":""}`} onClick={() => setProfile(p=>({...p,relationshipStatus:r}))}>{r}</div>)}</div></div>
        <div className="field"><label className="label">Pets</label><input className="input" placeholder="Any furry friends?" value={profile.pets} onChange={e => setProfile(p=>({...p,pets:e.target.value}))}/></div>
      </div>
    )},
    { title: "Your vibe 🎨", content: (
      <div>
        <div className="field"><label className="label">Hobbies</label><div style={{display:"flex",flexWrap:"wrap"}}>{HOBBIES.map(h => <div key={h} className={`chip ${profile.hobbies.includes(h)?"active":""}`} onClick={() => toggleArr("hobbies",h,profile,setProfile)}>{h}</div>)}</div></div>
        <div className="field"><label className="label">Interests</label><div style={{display:"flex",flexWrap:"wrap"}}>{INTERESTS.map(i => <div key={i} className={`chip ${profile.interests.includes(i)?"active":""}`} onClick={() => toggleArr("interests",i,profile,setProfile)}>{i}</div>)}</div></div>
      </div>
    )},
    { title: "Your story 💌", content: (
      <div>
        <div className="field"><label className="label">About you</label><textarea className="input" rows={4} placeholder="Tell potential matches about yourself..." value={profile.bio} onChange={e => setProfile(p=>({...p,bio:e.target.value}))} style={{resize:"none"}}/></div>
        <div className="field"><label className="label">Who are you looking for?</label><textarea className="input" rows={3} placeholder="Describe your ideal match..." value={profile.lookingFor} onChange={e => setProfile(p=>({...p,lookingFor:e.target.value}))} style={{resize:"none"}}/></div>
      </div>
    )},
  ];

  const matchResults = getMatches();
  const chatList = Object.keys(chats).map(id => allUsers.find(u=>u.id===id)).filter(Boolean);

  const FEATURES = [
    {icon:"👀",title:"See Who Liked You",desc:"Know who is interested before they message"},
    {icon:"🔥",title:"Profile Boost",desc:"Jump to the top of results for 1 hour"},
    {icon:"🌍",title:"Global Scout",desc:"Match with people worldwide"},
    {icon:"🎭",title:"Incognito Mode",desc:"Browse profiles without being seen"},
    {icon:"✅",title:"Verified Badge",desc:"Blue tick so people know you are real"},
    {icon:"📖",title:"Read Receipts",desc:"See when your messages were read"},
    {icon:"↩️",title:"Unlimited Rewinds",desc:"Undo accidental skips anytime"},
    {icon:"🚫",title:"Ad Free",desc:"Zero interruptions, pure vibes only"},
  ];
  const PLANS = [
    {id:"weekly",label:"Weekly",price:"$3.99",per:"per week",badge:null},
    {id:"monthly",label:"Monthly",price:"$9.99",per:"per month",badge:"Most Popular 🔥"},
    {id:"yearly",label:"Yearly",price:"$59.99",per:"per year - save 50%",badge:"Best Value 💎"},
  ];
  const ONE_TIME = [
    {icon:"🔥",title:"1x Boost",price:"$0.99",desc:"Top of results for 1 hour"},
    {icon:"🔥",title:"5x Boosts",price:"$3.99",desc:"Use whenever you want"},
    {icon:"⭐",title:"Super Like",price:"$0.49",desc:"Stand out to someone special"},
    {icon:"⭐",title:"10x Super Likes",price:"$3.49",desc:"Best value bundle"},
  ];
return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#fff5f8,#f0f4ff,#fff5f8)"}}>
      <style>{styles}</style>
      {splash && <Splash onDone={() => setSplash(false)}/>}

      {loading && <div style={{position:"fixed",inset:0,background:"rgba(255,255,255,0.8)",zIndex:9997,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontFamily:"'Fredoka One',cursive",fontSize:24,color:"#c44dff"}}>Loading... 💙</div></div>}

      {notif && <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:notif.type==="error"?"#ff4466":"linear-gradient(135deg,#ff6b9d,#c44dff)",color:"white",padding:"12px 28px",borderRadius:50,fontWeight:700,zIndex:9998,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",fontSize:14,whiteSpace:"nowrap"}}>{notif.msg}</div>}

      {showTC && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"white",borderRadius:24,padding:28,maxWidth:460,width:"100%",maxHeight:"80vh",overflowY:"auto"}}>
            <h2 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",fontSize:22,marginBottom:16}}>Terms and Conditions</h2>
            {[
              {title:"1. Age Requirement",body:"You must be 18 years or older to use Sparks."},
              {title:"2. Respectful Conduct",body:"Harassment or abusive behaviour is strictly prohibited."},
              {title:"3. Privacy and Photos",body:"Profile pictures are hidden by default. Never share someone elses photos without consent."},
              {title:"4. Authentic Profiles",body:"Fake profiles or impersonation is strictly forbidden."},
              {title:"5. Safety First",body:"Always meet in public places for first dates."},
              {title:"6. Content Policy",body:"Sending unsolicited explicit content is strictly prohibited."},
              {title:"7. Data and Privacy",body:"We never sell your personal data."},
              {title:"8. Account Termination",body:"Luminar reserves the right to suspend any account that violates these terms."},
            ].map(s => (
              <div key={s.title} style={{marginBottom:16}}>
                <div style={{fontWeight:800,color:"#553c7b",fontSize:14,marginBottom:4}}>{s.title}</div>
                <p style={{color:"#776699",fontSize:13,lineHeight:1.7}}>{s.body}</p>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button className="btn-secondary" style={{flex:1}} onClick={() => setShowTC(false)}>Close</button>
              <button className="btn-primary" style={{flex:1}} onClick={() => { setAgreedTC(true); setShowTC(false); showNotif("Terms accepted!"); }}>Accept</button>
            </div>
          </div>
        </div>
      )}

      {showCare && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:998,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"white",borderRadius:"24px 24px 0 0",padding:24,maxWidth:480,width:"100%",maxHeight:"90vh",overflowY:"auto",paddingBottom:32}}>
            {!careSent ? (
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:32}}>🎧</div>
                    <div><h2 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",fontSize:20}}>Customer Care</h2><p style={{color:"#a089c0",fontSize:12,fontWeight:600}}>We reply within 24 hours</p></div>
                  </div>
                  <button onClick={() => setShowCare(false)} style={{background:"#f5f0ff",border:"none",borderRadius:"50%",width:36,height:36,cursor:"pointer",fontSize:18,color:"#c44dff",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
                </div>
                <div style={{marginBottom:16}}>
                  <label className="label">What do you need help with?</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {["Premium not working","Account issue","Match problem","Payment query","Report a user","Other"].map(topic => (
                      <div key={topic} className={`chip ${careTopic===topic?"active":""}`} onClick={() => setCareTopic(topic)} style={{fontSize:12}}>{topic}</div>
                    ))}
                  </div>
                </div>
                <div className="field"><label className="label">Your message</label><textarea className="input" rows={5} placeholder="Describe your issue in detail..." value={careMsg} onChange={e => setCareMsg(e.target.value)} style={{resize:"none"}}/></div>
                <div style={{background:"#f5f0ff",borderRadius:12,padding:12,marginBottom:16,fontSize:13,color:"#8866bb",fontWeight:600}}>Reply will be sent to: {currentUser?.email}</div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn-secondary" style={{flex:1}} onClick={() => setShowCare(false)}>Cancel</button>
                  <button className="btn-primary" style={{flex:2}} onClick={() => { if(!careTopic||!careMsg.trim()) return showNotif("Fill in all fields!","error"); setCareSent(true); }}>Send Query</button>
                </div>
              </div>
            ) : (
              <div style={{textAlign:"center",padding:20}}>
                <div style={{fontSize:64,marginBottom:16}}>✅</div>
                <h2 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",fontSize:24,marginBottom:8}}>Query Sent!</h2>
                <p style={{color:"#776699",lineHeight:1.7,marginBottom:24}}>Our team will get back to you within 24 hours at {currentUser?.email}</p>
                <button className="btn-primary" onClick={() => setShowCare(false)}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

{screen === "signup" && (
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{maxWidth:420,width:"100%"}}>
            <div style={{textAlign:"center",marginBottom:40}}>
              <div style={{fontSize:64,marginBottom:8}}>💘</div>
              <h1 className="brand" style={{fontSize:48,lineHeight:1}}>Sparks</h1>
              <p style={{color:"#a089c0",marginTop:8,fontWeight:600}}>Find your connection, build it first</p>
            </div>
            <div className="card">
              {!isLogin ? (
                <div>
                  <h2 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:24,fontSize:24}}>Create account ✨</h2>
                  <div className="field"><label className="label">Email</label><input className="input" type="email" placeholder="your@email.com" value={signupData.email} onChange={e => setSignupData(p=>({...p,email:e.target.value}))}/></div>
                  <div className="field">
                    <label className="label">Username</label>
                    <input className="input" placeholder="your_username" value={signupData.username} onChange={e => setSignupData(p=>({...p,username:e.target.value.toLowerCase().replace(/\s/g,"_")}))} style={{borderColor:signupData.username.length>2?"#44bb66":"#f0e6ff"}}/>
                    {signupData.username.length > 2 && <div style={{marginTop:8,fontSize:13,fontWeight:700,color:"#44bb66"}}>Username available!</div>}
                  </div>
                  <div className="field"><label className="label">Date of Birth</label><DOBPicker onChange={dob => setSignupData(p=>({...p,dob}))}/></div>
                  <div className="field"><label className="label">Password</label><input className="input" type="password" placeholder="Min. 6 characters" value={signupData.password} onChange={e => setSignupData(p=>({...p,password:e.target.value}))}/></div>
                  <div className="field"><label className="label">Confirm Password</label><input className="input" type="password" placeholder="Repeat your password" value={signupData.confirm} onChange={e => setSignupData(p=>({...p,confirm:e.target.value}))}/></div>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:20,background:"#fdf8ff",borderRadius:12,padding:14,border:"2px solid #f0e6ff"}}>
                    <input type="checkbox" id="tc" checked={agreedTC} onChange={e => setAgreedTC(e.target.checked)} style={{width:18,height:18,marginTop:2,accentColor:"#c44dff",cursor:"pointer",flexShrink:0}}/>
                    <label htmlFor="tc" style={{fontSize:13,color:"#776699",cursor:"pointer",lineHeight:1.5}}>I agree to the <span style={{color:"#c44dff",fontWeight:700,textDecoration:"underline",cursor:"pointer"}} onClick={() => setShowTC(true)}>Terms and Conditions</span> and confirm I am 18 or older</label>
                  </div>
                  <button className="btn-primary" onClick={handleSignup}>Lets go! 🚀</button>
                  <div style={{textAlign:"center",marginTop:20}}><span style={{color:"#aaa",fontSize:14}}>Already have an account? </span><span style={{color:"#c44dff",fontWeight:700,cursor:"pointer"}} onClick={() => setIsLogin(true)}>Log in</span></div>
                </div>
              ) : (
                <div>
                  <h2 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:24,fontSize:24}}>Welcome back! 💕</h2>
                  <div className="field"><label className="label">Email</label><input className="input" type="email" placeholder="your@email.com" value={signupData.email} onChange={e => setSignupData(p=>({...p,email:e.target.value}))}/></div>
                  <div className="field"><label className="label">Password</label><input className="input" type="password" placeholder="password" value={signupData.password} onChange={e => setSignupData(p=>({...p,password:e.target.value}))}/></div>
                  <button className="btn-primary" onClick={handleLogin}>Log in 💘</button>
                  <div style={{textAlign:"center",marginTop:20}}><span style={{color:"#aaa",fontSize:14}}>New here? </span><span style={{color:"#c44dff",fontWeight:700,cursor:"pointer"}} onClick={() => setIsLogin(false)}>Sign up</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {screen === "setup" && (
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{maxWidth:480,width:"100%"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <h1 className="brand" style={{fontSize:36}}>Sparks 💘</h1>
              <p style={{color:"#a089c0",fontWeight:600,marginTop:4}}>Step {setupStep+1} of {SETUP_STEPS.length}</p>
            </div>
            <div className="progress-bar" style={{marginBottom:24}}><div className="progress-fill" style={{width:`${((setupStep+1)/SETUP_STEPS.length)*100}%`}}/></div>
            <div className="card">
              <h2 className="section-title">{SETUP_STEPS[setupStep].title}</h2>
              <div style={{maxHeight:420,overflowY:"auto",paddingRight:4}}>{SETUP_STEPS[setupStep].content}</div>
              <div style={{display:"flex",gap:12,marginTop:24}}>
                {setupStep > 0 && <button className="btn-secondary" style={{flex:1}} onClick={() => setSetupStep(p=>p-1)}>Back</button>}
                {setupStep < SETUP_STEPS.length-1
                  ? <button className="btn-primary" style={{flex:2}} onClick={() => setSetupStep(p=>p+1)}>Next ✨</button>
                  : <button className="btn-primary" style={{flex:2}} onClick={finishSetup}>Find my match! 💘</button>}
              </div>
            </div>
          </div>
        </div>
      )}
{screen === "main" && (
        <div style={{maxWidth:480,margin:"0 auto",paddingBottom:80}}>
          <div style={{background:"white",padding:"20px 24px 16px",borderBottom:"2px solid #f0e6ff",position:"sticky",top:0,zIndex:50}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <h1 className="brand" style={{fontSize:32}}>Sparks 💘</h1>
                {incognito && <div style={{background:"linear-gradient(135deg,#2d1b4e,#553c7b)",color:"white",borderRadius:50,padding:"2px 10px",fontSize:11,fontWeight:700,display:"inline-block",marginTop:4}}>🎭 Incognito</div>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:28}}>{currentUser?.profile_pic||currentUser?.profilePic||"😊"}</span>
                <div>
                  <div style={{fontWeight:800,color:"#553c7b",fontSize:14}}>@{currentUser?.username}</div>
                  <div style={{fontSize:12,color:"#a089c0"}}>{currentUser?.location||currentUser?.city} 📍</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{padding:"0 16px"}}>
            {activeTab === "scout" && (
              <div style={{paddingTop:20}}>
                <h2 className="section-title">Scout matches 🔍</h2>
                <p style={{color:"#a089c0",fontSize:14,marginBottom:16,fontWeight:600}}>Profile pics are hidden until you connect. Build the vibe first!</p>

                {isPremium && (
                  <div style={{background:"linear-gradient(135deg,#553c7b22,#c44dff22)",borderRadius:16,padding:14,marginBottom:16,border:"2px solid #c44dff44"}}>
                    <div style={{fontWeight:800,color:"#553c7b",fontSize:13,marginBottom:8}}>👑 Premium Active</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {["🌍 Global Scout","🎭 Incognito","👀 Who Liked You","✅ Verified","📖 Read Receipts"].map(f => (
                        <span key={f} style={{background:"white",color:"#c44dff",borderRadius:50,padding:"4px 10px",fontSize:11,fontWeight:700,border:"1px solid #c44dff44"}}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div onClick={() => { if(!isPremium){setActiveTab("premium");return;} setIncognito(p=>!p); showNotif(incognito?"Incognito off - you are visible again!":"Incognito on - you are now invisible!"); }} style={{background:incognito?"linear-gradient(135deg,#2d1b4e,#553c7b)":isPremium?"white":"#f5f5f5",borderRadius:16,padding:16,marginBottom:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",border:incognito?"2px solid #553c7b":"2px solid #f0e6ff"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:28}}>🎭</div>
                    <div>
                      <div style={{fontWeight:800,color:incognito?"white":"#553c7b",fontSize:15}}>Incognito Mode</div>
                      <div style={{fontSize:12,color:incognito?"rgba(255,255,255,0.8)":"#a089c0",marginTop:2}}>{incognito?"You are invisible to others":"Browse without being seen"}</div>
                    </div>
                  </div>
                  <div style={{width:48,height:26,borderRadius:50,background:incognito?"#c44dff":"#ddd",position:"relative",transition:"background 0.3s",flexShrink:0}}>
                    <div style={{position:"absolute",top:3,left:incognito?22:3,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.3s",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}/>
                  </div>
                </div>

                <div onClick={activateBoost} style={{background:boostActive?"linear-gradient(135deg,#ff6b00,#ff9900)":isPremium?"white":"#f5f5f5",borderRadius:16,padding:16,marginBottom:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",border:boostActive?"2px solid #ff6b00":"2px solid #f0e6ff"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:32}}>🔥</div>
                    <div>
                      <div style={{fontWeight:800,color:boostActive?"white":"#553c7b",fontSize:15}}>{boostActive?"Boost Active!":"Boost Profile"}</div>
                      <div style={{fontSize:12,color:boostActive?"rgba(255,255,255,0.85)":"#a089c0",marginTop:2}}>{boostActive?`${fmtBoost(boostTime)} remaining`:isPremium?"Jump to top for 1 hour":"Premium only"}</div>
                    </div>
                  </div>
                  <div style={{background:boostActive?"rgba(255,255,255,0.25)":"linear-gradient(135deg,#ff6b9d,#c44dff)",borderRadius:50,padding:"6px 14px",color:"white",fontWeight:800,fontSize:13}}>{boostActive?"LIVE":"Boost"}</div>
                </div>

                <div style={{marginBottom:20}}>
                  <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",fontSize:18,marginBottom:12}}>Who Liked You 💜</h3>
                  {isPremium ? (
                    <div>
                      {likes.length === 0 ? (
                        <div style={{background:"white",borderRadius:16,padding:20,border:"2px solid #f0e6ff",textAlign:"center",color:"#a089c0",fontWeight:600}}>No likes yet! Keep scouting</div>
                      ) : likes.map(user => (
                        <div key={user.id} style={{background:"white",borderRadius:16,padding:16,border:"2px solid #f0e6ff",marginBottom:10,display:"flex",alignItems:"center",gap:14}}>
                          <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#ffe0ee,#f0e6ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{user.profile_pic||"😊"}</div>
                          <div style={{flex:1}}><div style={{fontWeight:800,color:"#553c7b"}}>@{user.username}</div><div style={{fontSize:12,color:"#a089c0",marginTop:2}}>📍 {user.location}</div></div>
                          <button className="btn-primary" style={{width:"auto",padding:"8px 16px",fontSize:13}} onClick={() => startChat(user)}>💬 Chat</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{background:"white",borderRadius:16,border:"2px solid #f0e6ff",overflow:"hidden"}}>
                      <div style={{padding:"12px 16px",borderBottom:"1px solid #f0e6ff",fontWeight:700,color:"#553c7b",fontSize:13}}>💜 {likes.length} {likes.length===1?"person":"people"} liked you!</div>
                      {likes.map((user,idx) => (
                        <div key={user.id} style={{padding:16,display:"flex",alignItems:"center",gap:14,borderBottom:"1px solid #f0e6ff",userSelect:"none",pointerEvents:"none",position:"relative",overflow:"hidden"}}>
                          <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#ddd,#eee)",flexShrink:0,filter:"blur(8px)"}}/>
                          <div style={{flex:1,filter:"blur(8px)"}}>
                            <div style={{fontWeight:800,color:"#553c7b"}}>@{"█".repeat(8+idx)}</div>
                            <div style={{fontSize:12,color:"#a089c0"}}>📍 {"█".repeat(6+idx)}</div>
                          </div>
                          <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,0.15)"}}/>
                        </div>
                      ))}
                      <div style={{padding:16,textAlign:"center",background:"linear-gradient(135deg,#fff5f8,#f0e6ff)"}}>
                        <div style={{fontWeight:800,color:"#553c7b",fontSize:14,marginBottom:8}}>👑 Upgrade to see who liked you!</div>
                        <button className="btn-primary" style={{width:"auto",padding:"10px 24px",fontSize:13}} onClick={() => setActiveTab("premium")}>Unlock Premium 💎</button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{background:"white",borderRadius:16,padding:16,marginBottom:20,border:"2px solid #f0e6ff"}}>
                  <div style={{fontWeight:800,color:"#553c7b",fontSize:14,marginBottom:10}}>Age Range: {ageMin} - {ageMax}</div>
                  <div style={{display:"flex",gap:12}}>
                    <div style={{flex:1}}><label style={{fontSize:11,color:"#a089c0",fontWeight:700}}>Min</label><input type="range" min={18} max={ageMax-1} value={ageMin} onChange={e => setAgeMin(parseInt(e.target.value))} style={{width:"100%",accentColor:"#c44dff"}}/><div style={{textAlign:"center",fontWeight:800,color:"#c44dff",fontSize:14}}>{ageMin}</div></div>
                    <div style={{flex:1}}><label style={{fontSize:11,color:"#a089c0",fontWeight:700}}>Max</label><input type="range" min={ageMin+1} max={70} value={ageMax} onChange={e => setAgeMax(parseInt(e.target.value))} style={{width:"100%",accentColor:"#c44dff"}}/><div style={{textAlign:"center",fontWeight:800,color:"#c44dff",fontSize:14}}>{ageMax}</div></div>
                  </div>
                </div>

                {matchResults.length === 0 ? (
                  <div style={{textAlign:"center",padding:40,color:"#a089c0"}}>
                    <div style={{fontSize:48}}>😢</div>
                    <p style={{fontWeight:700,marginTop:12}}>No matches yet! Share the app with friends 💙</p>
                  </div>
                ) : matchResults.map(user => (
                  <div key={user.id} className="match-card" style={{border:user.isBoosted?"2px solid #ff6b00":"2px solid #f0e6ff",background:user.isBoosted?"linear-gradient(135deg,#fff8f0,#fff5f8)":"white"}}>
                    {user.isBoosted && <div style={{background:"linear-gradient(135deg,#ff6b00,#ff9900)",borderRadius:10,padding:"6px 14px",marginBottom:12,display:"inline-flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>🔥</span><span style={{color:"white",fontWeight:800,fontSize:12}}>BOOSTED - You are at the top!</span></div>}
                    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                      <div>
                        <div style={{width:60,height:60,borderRadius:"50%",background:"#f5f0ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,filter:"blur(8px)",border:"3px solid #f0e6ff"}}>{user.profile_pic||"😊"}</div>
                        <div style={{textAlign:"center",fontSize:11,color:"#c44dff",fontWeight:700,marginTop:4}}>Hidden 🔒</div>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{fontWeight:800,color:"#553c7b",fontSize:16}}>@{user.username} {isPremium?"✅":""}</div>
                          <div style={{fontSize:11,color:user.online?"#44ee88":"#bbb",fontWeight:700}}>{user.online?"🟢 Online":"⚫ Offline"}</div>
                        </div>
                        <div style={{fontSize:13,color:"#a089c0",marginTop:2}}>📍 {user.location||user.city} {user.age?`• 🎂 ${user.age} yrs`:""}</div>
                        <div style={{marginTop:8,display:"flex",flexWrap:"wrap"}}>{(user.interests||[]).slice(0,3).map(i => <span key={i} className="badge">{i}</span>)}</div>
                        <div style={{marginTop:6,fontSize:13,color:"#776699",fontWeight:600}}>🎯 {user.score||0}% match {user.work?`• 💼 ${user.work}`:""}</div>
                        <div style={{display:"flex",gap:8,marginTop:12}}>
                          <button className="btn-primary" style={{flex:2,padding:"10px 12px",fontSize:13}} onClick={() => startChat(user)}>💬 Chat</button>
                          <button onClick={() => likeUser(user.id)} style={{flex:1,padding:"10px 12px",fontSize:13,background:"#f5f0ff",border:"2px solid #f0e6ff",borderRadius:50,cursor:"pointer",fontWeight:700,color:"#c44dff"}}>💜 Like</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
{activeTab === "chats" && !activeChat && (
              <div style={{paddingTop:20}}>
                <h2 className="section-title">Your chats 💬</h2>
                {chatList.length === 0 ? (
                  <div style={{textAlign:"center",padding:40,color:"#a089c0"}}>
                    <div style={{fontSize:48}}>💬</div>
                    <p style={{fontWeight:700,marginTop:12}}>No chats yet! Go scout some matches</p>
                    <button className="btn-primary" style={{marginTop:16}} onClick={() => setActiveTab("scout")}>Scout now 🔍</button>
                  </div>
                ) : chatList.map(user => (
                  <div key={user.id} className="match-card" style={{display:"flex",alignItems:"center",gap:16,cursor:"pointer"}} onClick={() => startChat(user)}>
                    <div style={{position:"relative"}}>
                      <div style={{width:52,height:52,borderRadius:"50%",background:"#f5f0ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:getReveal(user.id).theyShared?28:24,filter:getReveal(user.id).theyShared?"none":"blur(4px)"}}>{user.profile_pic||"😊"}</div>
                      {user.online && <div style={{position:"absolute",bottom:2,right:2,width:12,height:12,background:"#44ee88",borderRadius:"50%",border:"2px solid white"}}/>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,color:"#553c7b"}}>@{user.username}</div>
                      <div style={{fontSize:13,color:"#a089c0"}}>{(chats[user.id]||[]).slice(-1)[0]?.text?.slice(0,40)}...</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "chats" && activeChat && (
              <div style={{paddingTop:8}}>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"2px solid #f0e6ff",marginBottom:16}}>
                  <button onClick={() => setActiveChat(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#c44dff"}}>←</button>
                  <div style={{width:44,height:44,borderRadius:"50%",background:"#f5f0ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:getReveal(activeChat.id).theyShared?24:20,filter:getReveal(activeChat.id).theyShared?"none":"blur(4px)"}}>{activeChat.profile_pic||"😊"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,color:"#553c7b"}}>@{activeChat.username}</div>
                    <div style={{fontSize:12,color:activeChat.online?"#44ee88":"#bbb",fontWeight:600}}>{activeChat.online?"🟢 Online":"⚫ Offline"}</div>
                  </div>
                  <button style={{background:"#f5f0ff",border:"none",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:16}} onClick={() => showNotif("Voice calling... (coming soon!)")}>📞</button>
                  <button style={{background:"#f5f0ff",border:"none",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:16}} onClick={() => showNotif("Video calling... (coming soon!)")}>📹</button>
                </div>
                <div style={{background:"#f5f0ff",borderRadius:16,padding:16,marginBottom:16}}>
                  <p style={{color:"#8866bb",fontWeight:800,fontSize:13,marginBottom:10,textAlign:"center"}}>Profile pics are private - share yours when you are ready!</p>
                  <div style={{display:"flex",gap:10}}>
                    <div style={{flex:1,background:"white",borderRadius:12,padding:10,textAlign:"center"}}>
                      <div style={{fontSize:11,color:"#a089c0",fontWeight:700,marginBottom:6}}>YOUR pic</div>
                      {getReveal(activeChat.id).iShared?<div style={{color:"#44bb66",fontWeight:800,fontSize:13}}>Shared!</div>:<button onClick={() => shareMyPic(activeChat.id)} style={{background:"linear-gradient(135deg,#ff6b9d22,#c44dff22)",color:"#c44dff",border:"2px dashed #c44dff",borderRadius:12,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Share my pic</button>}
                    </div>
                    <div style={{flex:1,background:"white",borderRadius:12,padding:10,textAlign:"center"}}>
                      <div style={{fontSize:11,color:"#a089c0",fontWeight:700,marginBottom:6}}>THEIR pic</div>
                      {getReveal(activeChat.id).theyShared?<div style={{fontSize:28}}>{activeChat.profile_pic||"😊"}</div>:<div style={{color:"#c44dff",fontWeight:700,fontSize:12}}>{getReveal(activeChat.id).iShared?"Waiting...":"🔒 Hidden"}</div>}
                    </div>
                  </div>
                </div>
                {getReveal(activeChat.id).theyShared && (
                  <div style={{background:"linear-gradient(135deg,#ffe0ee,#f0e6ff)",borderRadius:16,padding:16,marginBottom:16,textAlign:"center"}}>
                    <div style={{fontSize:48}}>{activeChat.profile_pic||"😊"}</div>
                    <p style={{color:"#8866bb",fontWeight:700,fontSize:14,marginTop:8}}>They shared their pic with you!</p>
                  </div>
                )}
                <div style={{display:"flex",flexDirection:"column",gap:8,minHeight:300,marginBottom:16}}>
                  {(chats[activeChat.id]||[]).map((msg,i) => (
                    <div key={i} style={{display:"flex",justifyContent:msg.from==="me"?"flex-end":"flex-start"}}>
                      <div className={`chat-bubble ${msg.from==="me"?"sent":"received"}`}>
                        {msg.text}
                        <div style={{fontSize:10,opacity:0.8,marginTop:4,display:"flex",alignItems:"center",justifyContent:msg.from==="me"?"flex-end":"flex-start",gap:4}}>
                          <span>{msg.time}</span>
                          {msg.from==="me"&&isPremium&&<span style={{fontSize:12,color:msg.status==="read"?"#90e0ef":"rgba(255,255,255,0.6)",fontWeight:700}}>{msg.status==="read"?"✓✓":"✓"}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,position:"sticky",bottom:80}}>
                  <button style={{background:"#f5f0ff",border:"none",borderRadius:12,padding:"12px 14px",cursor:"pointer",fontSize:16}} onClick={() => showNotif("Send pic (coming soon!)")}>📷</button>
                  <input className="input" style={{flex:1}} placeholder="Say something sweet..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&sendMsg()}/>
                  <button className="btn-primary" style={{width:"auto",padding:"12px 18px"}} onClick={sendMsg}>Send 💌</button>
                </div>
              </div>
            )}
{activeTab === "premium" && (
              <div style={{paddingTop:20}}>
                {isPremium && (
                  <div style={{background:"linear-gradient(135deg,#553c7b,#c44dff)",borderRadius:20,padding:20,marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
                    <div style={{fontSize:40}}>👑</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:"white"}}>Sparks Premium Active!</div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:2}}>Plan: {isPremium?.plan}</div>
                    </div>
                    <button onClick={() => { setIsPremium(false); showNotif("Subscription cancelled"); }} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"8px 12px",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Nunito,sans-serif"}}>Cancel</button>
                  </div>
                )}
                {!isPremium && (
                  <div style={{background:"linear-gradient(135deg,#553c7b,#c44dff)",borderRadius:24,padding:28,marginBottom:20,textAlign:"center",color:"white"}}>
                    <div style={{fontSize:48}}>👑</div>
                    <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:28,marginTop:8}}>Sparks Premium</h2>
                    <p style={{opacity:0.85,marginTop:6,fontSize:14,fontWeight:600}}>Unlock the full experience 💎</p>
                  </div>
                )}
                <div className="card" style={{marginBottom:16}}>
                  <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:16}}>{isPremium?"Your perks 💎":"What you get ✨"}</h3>
                  {FEATURES.map(f => (
                    <div key={f.title} style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
                      <div style={{fontSize:28,flexShrink:0}}>{f.icon}</div>
                      <div><div style={{fontWeight:800,color:"#553c7b",fontSize:14}}>{f.title}</div><div style={{color:"#a089c0",fontSize:13,marginTop:2}}>{f.desc}</div></div>
                      <div style={{marginLeft:"auto",color:isPremium?"#44bb66":"#ddd",fontSize:18}}>✓</div>
                    </div>
                  ))}
                </div>
                <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:12}}>{isPremium?"Switch plan 🔄":"Choose your plan 💰"}</h3>
                {PLANS.map(plan => {
                  const isCurrent = isPremium?.planId === plan.id;
                  return (
                    <div key={plan.id} onClick={() => { setIsPremium({plan:plan.label,price:plan.price,planId:plan.id}); showNotif(`Welcome to Sparks Premium ${plan.label}!`); }} style={{background:isCurrent?"#f5f0ff":"white",borderRadius:20,padding:20,marginBottom:12,border:isCurrent?"2px solid #c44dff":plan.badge?"2px solid #f0c0ff":"2px solid #f0e6ff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div>
                        {plan.badge&&<div style={{background:"linear-gradient(135deg,#ff6b9d,#c44dff)",color:"white",borderRadius:50,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-block",marginBottom:6}}>{plan.badge}</div>}
                        {isCurrent&&<div style={{background:"#44bb6622",color:"#44bb66",borderRadius:50,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-block",marginBottom:6}}>Current Plan</div>}
                        <div style={{fontWeight:800,color:"#553c7b",fontSize:16}}>{plan.label}</div>
                        <div style={{color:"#a089c0",fontSize:12,fontWeight:600}}>{plan.per}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:24,background:"linear-gradient(135deg,#ff6b9d,#c44dff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{plan.price}</div>
                        <div style={{fontSize:11,color:"#c44dff",fontWeight:700}}>{isCurrent?"Active":"Tap to switch"}</div>
                      </div>
                    </div>
                  );
                })}
                <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",margin:"20px 0 12px"}}>One-time purchases 🛒</h3>
                {ONE_TIME.map(item => (
                  <div key={item.title+item.price} onClick={() => showNotif(`${item.icon} ${item.title} purchased! (demo)`)} style={{background:"white",borderRadius:16,padding:16,marginBottom:10,border:"2px solid #f0e6ff",cursor:"pointer",display:"flex",alignItems:"center",gap:14}}>
                    <div style={{fontSize:28}}>{item.icon}</div>
                    <div style={{flex:1}}><div style={{fontWeight:800,color:"#553c7b",fontSize:14}}>{item.title}</div><div style={{color:"#a089c0",fontSize:12}}>{item.desc}</div></div>
                    <div style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:"#c44dff"}}>{item.price}</div>
                  </div>
                ))}
                <div style={{height:20}}/>
              </div>
            )}

            {activeTab === "profile" && !editMode && (
              <div style={{paddingTop:20}}>
                <div style={{textAlign:"center",marginBottom:24,position:"relative"}}>
                  <div style={{position:"absolute",top:0,right:0}}>
                    <button onClick={() => setShowDots(p=>!p)} style={{background:"#f5f0ff",border:"none",borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:18,color:"#c44dff"}}>⋮</button>
                    {showDots && (
                      <div style={{position:"absolute",right:0,top:44,background:"white",borderRadius:16,boxShadow:"0 8px 32px rgba(196,77,255,0.2)",border:"2px solid #f0e6ff",zIndex:100,minWidth:180,overflow:"hidden"}}>
                        {[
                          {icon:"✏️",label:"Edit Profile",action:() => { setEditData({...currentUser}); setEditMode(true); setShowDots(false); }},
                          {icon:"👑",label:"Premium",action:() => { setActiveTab("premium"); setShowDots(false); }},
                          {icon:"🎧",label:"Customer Care",action:() => { setShowCare(true); setShowDots(false); setCareSent(false); setCareTopic(""); setCareMsg(""); }},
                          {icon:"🚪",label:"Log Out",action:handleLogout},
                        ].map(item => (
                          <div key={item.label} onClick={item.action} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:14,fontWeight:700,color:item.label==="Log Out"?"#ff4466":"#553c7b",borderBottom:"1px solid #f0e6ff"}}>
                            <span>{item.icon}</span>{item.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{fontSize:72,marginBottom:8}}>{currentUser?.profile_pic||currentUser?.profilePic||"😊"}</div>
                  <h2 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",fontSize:28}}>@{currentUser?.username}</h2>
                  {isPremium&&<div style={{display:"inline-block",background:"linear-gradient(135deg,#ff6b9d,#c44dff)",color:"white",borderRadius:50,padding:"4px 14px",fontSize:12,fontWeight:700,margin:"6px 0"}}>👑 {currentUser?.isDevAccount?"DEV MODE - CEO Access":`Premium - ${isPremium?.plan}`}</div>}
                  <p style={{color:"#a089c0",fontWeight:600}}>📍 {currentUser?.location||currentUser?.city}</p>
                  <div style={{marginTop:16}}><button className="btn-primary" style={{width:"auto",padding:"10px 28px",fontSize:14}} onClick={() => { setEditData({...currentUser}); setEditMode(true); }}>✏️ Edit Profile</button></div>
                </div>
                <div className="card" style={{marginBottom:16}}>
                  <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:12}}>About me 💙</h3>
                  <p style={{color:"#776699",lineHeight:1.7}}>{currentUser?.bio||"No bio yet!"}</p>
                </div>
                <div className="card" style={{marginBottom:16}}>
                  <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:12}}>Details ✨</h3>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {currentUser?.work&&<div style={{color:"#776699",fontWeight:600}}>💼 {currentUser.work}</div>}
                    {(currentUser?.relationship_status||currentUser?.relationshipStatus)&&<div style={{color:"#776699",fontWeight:600}}>💍 {currentUser.relationship_status||currentUser.relationshipStatus}</div>}
                    {currentUser?.pets&&<div style={{color:"#776699",fontWeight:600}}>🐾 {currentUser.pets}</div>}
                    {currentUser?.gender&&<div style={{color:"#776699",fontWeight:600}}>🏳️ {currentUser.gender} - {currentUser.orientation}</div>}
                  </div>
                </div>
                {(currentUser?.hobbies||[]).length>0&&(
                  <div className="card" style={{marginBottom:16}}>
                    <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:12}}>Hobbies 🎨</h3>
                    <div style={{display:"flex",flexWrap:"wrap"}}>{(currentUser.hobbies||[]).map(h=><span key={h} className="chip active">{h}</span>)}</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && editMode && (
              <div style={{paddingTop:20}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
                  <button onClick={() => setEditMode(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#c44dff"}}>←</button>
                  <h2 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",fontSize:24}}>Edit Profile ✏️</h2>
                </div>
                <div className="card" style={{marginBottom:16}}>
                  <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:12}}>Your Avatar 🎭</h3>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,touchAction:"pan-y"}}>
                    {AVATARS.map(e=><div key={e} onClick={() => setEditData(p=>({...p,profile_pic:e}))} style={{fontSize:28,padding:10,borderRadius:12,cursor:"pointer",border:(editData.profile_pic||editData.profilePic)===e?"3px solid #c44dff":"3px solid #f0e6ff",background:(editData.profile_pic||editData.profilePic)===e?"#f5f0ff":"white",width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</div>)}
                  </div>
                </div>
                <div className="card" style={{marginBottom:16}}>
                  <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:12}}>Basic Info ✨</h3>
                  <div className="field"><label className="label">Username</label><input className="input" value={editData.username||""} onChange={e => setEditData(p=>({...p,username:e.target.value}))}/></div>
                  <div className="field"><label className="label">Country 🌍</label><select className="input" value={editData.country||""} onChange={e => setEditData(p=>({...p,country:e.target.value,location:p.city?`${p.city}, ${e.target.value}`:e.target.value}))} style={{cursor:"pointer"}}><option value="">Select country...</option>{COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                  <div className="field"><label className="label">City 🏙️</label><input className="input" placeholder="Your city..." value={editData.city||""} onChange={e => setEditData(p=>({...p,city:e.target.value,location:p.country?`${e.target.value}, ${p.country}`:e.target.value}))}/></div>
                  <div className="field"><label className="label">Work 💼</label><input className="input" value={editData.work||""} onChange={e => setEditData(p=>({...p,work:e.target.value}))}/></div>
                  <div className="field"><label className="label">Pets 🐾</label><input className="input" value={editData.pets||""} onChange={e => setEditData(p=>({...p,pets:e.target.value}))}/></div>
                  <div className="field"><label className="label">Relationship Status</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{STATUSES.map(r=><div key={r} className={`chip ${(editData.relationship_status||editData.relationshipStatus)===r?"active":""}`} onClick={() => setEditData(p=>({...p,relationship_status:r}))} style={{fontSize:12}}>{r}</div>)}</div></div>
                </div>
                <div className="card" style={{marginBottom:16}}>
                  <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:12}}>Hobbies 🎨</h3>
                  <div style={{display:"flex",flexWrap:"wrap"}}>{HOBBIES.map(h=><div key={h} className={`chip ${(editData.hobbies||[]).includes(h)?"active":""}`} onClick={() => setEditData(p=>({...p,hobbies:(p.hobbies||[]).includes(h)?p.hobbies.filter(x=>x!==h):[...(p.hobbies||[]),h]}))} style={{fontSize:12}}>{h}</div>)}</div>
                  <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",margin:"16px 0 12px"}}>Interests 💡</h3>
                  <div style={{display:"flex",flexWrap:"wrap"}}>{INTERESTS.map(i=><div key={i} className={`chip ${(editData.interests||[]).includes(i)?"active":""}`} onClick={() => setEditData(p=>({...p,interests:(p.interests||[]).includes(i)?p.interests.filter(x=>x!==i):[...(p.interests||[]),i]}))} style={{fontSize:12}}>{i}</div>)}</div>
                </div>
                <div className="card" style={{marginBottom:24}}>
                  <h3 style={{fontFamily:"'Fredoka One',cursive",color:"#553c7b",marginBottom:12}}>Your Story 💌</h3>
                  <div className="field"><label className="label">About you</label><textarea className="input" rows={4} value={editData.bio||""} onChange={e => setEditData(p=>({...p,bio:e.target.value}))} style={{resize:"none"}}/></div>
                  <div className="field"><label className="label">Who you are looking for</label><textarea className="input" rows={3} value={editData.looking_for||editData.lookingFor||""} onChange={e => setEditData(p=>({...p,looking_for:e.target.value}))} style={{resize:"none"}}/></div>
                </div>
                <button className="btn-primary" style={{marginBottom:24}} onClick={saveProfile}>Save Changes 💾</button>
              </div>
            )}

          </div>

          <div className="nav">
            {[{id:"scout",icon:"🔍",label:"Scout"},{id:"chats",icon:"💬",label:"Chats"},{id:"premium",icon:"👑",label:"Premium"},{id:"profile",icon:"😊",label:"Profile"}].map(tab => (
              <button key={tab.id} className={`nav-btn ${activeTab===tab.id?"active":"inactive"}`} onClick={() => { setActiveTab(tab.id); setActiveChat(null); }}>
                <span style={{fontSize:22}}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

