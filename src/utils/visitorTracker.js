// Real-Time Visitor & Traffic Tracking Service
import { recordVisitorToFirestore, subscribeToVisitorStatsFromFirestore } from './firestoreService';

const VISITOR_STORAGE_KEY = 'moviehub_real_visitor_metrics';
const SESSION_STORAGE_KEY = 'moviehub_active_session_id';

export const initVisitorTracker = () => {
  try {
    const raw = localStorage.getItem(VISITOR_STORAGE_KEY);
    const todayStr = new Date().toISOString().split('T')[0];

    let metrics = raw ? JSON.parse(raw) : {
      totalVisits: 1,
      uniqueVisitors: 1,
      todayVisits: 1,
      totalPageViews: 1,
      lastDate: todayStr
    };

    // Reset todayVisits if it's a new date
    if (metrics.lastDate !== todayStr) {
      metrics.todayVisits = 1;
      metrics.lastDate = todayStr;
    }

    let isNewVisitor = false;
    const isSessionRecorded = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!isSessionRecorded) {
      metrics.totalVisits = (metrics.totalVisits || 0) + 1;
      metrics.todayVisits = (metrics.todayVisits || 0) + 1;
      metrics.uniqueVisitors = (metrics.uniqueVisitors || 0) + 1;
      sessionStorage.setItem(SESSION_STORAGE_KEY, `session-${Date.now()}`);
      isNewVisitor = true;
    }

    metrics.totalPageViews = (metrics.totalPageViews || 0) + 1;

    localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(metrics));

    // Record to Firebase Firestore
    recordVisitorToFirestore(isNewVisitor);

    return metrics;
  } catch (err) {
    console.warn('Visitor tracker fallback:', err);
    return {
      totalVisits: 1,
      uniqueVisitors: 1,
      todayVisits: 1,
      totalPageViews: 1
    };
  }
};

export const getVisitorStats = () => {
  try {
    const raw = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    totalVisits: 1,
    uniqueVisitors: 1,
    todayVisits: 1,
    totalPageViews: 1
  };
};

export const recordPageView = () => {
  try {
    const stats = getVisitorStats();
    stats.totalPageViews = (stats.totalPageViews || 0) + 1;
    localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(stats));
    window.dispatchEvent(new Event('visitor_update'));
    recordVisitorToFirestore(false);
    return stats;
  } catch {
    return getVisitorStats();
  }
};
