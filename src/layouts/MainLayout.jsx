import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/layout/Footer';
import SkillRequestModal from '../components/marketplace/SkillRequestModal';
import styles from './MainLayout.module.scss';

export default function MainLayout() {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <SkillRequestModal />
    </div>
  );
}
