import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Drawer,
  Stack,
  Chip,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import ServiceCard from '../../components/marketplace/ServiceCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import { CATEGORIES, getCategoryById } from '../../data/categories';
import { LOCATIONS, getLocationById } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useDebounce } from '../../hooks/useDebounce';
import { formatNumber } from '../../utils/formatters';
import styles from './ExplorePage.module.scss';

const PAGE_SIZE = 9;

export default function ExplorePage() {
  const { lang, isRTL, l } = useLanguage();
  const { hasToken, isProfessional } = useAuth();
  const { advertisements, professionals, openSkillRequestModal } = useMarketplace();
  const [searchParams, setSearchParams] = useSearchParams();

  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('lg'));

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [subcategory, setSubcategory] = useState(searchParams.get('subcategory') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [minExp, setMinExp] = useState('0');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [weekendOnly, setWeekendOnly] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [viewMode, setViewMode] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const debouncedQuery = useDebounce(query, 180);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || '');
    setSubcategory(searchParams.get('subcategory') || '');
    setLocation(searchParams.get('location') || '');
    setSortBy(searchParams.get('sort') || 'popular');
  }, [searchParams]);

  useEffect(() => {
    setIsFiltering(true);
    setVisibleCount(PAGE_SIZE);
    const t = setTimeout(() => setIsFiltering(false), 160);
    return () => clearTimeout(t);
  }, [
    debouncedQuery,
    category,
    subcategory,
    location,
    minPrice,
    maxPrice,
    minRating,
    minExp,
    urgentOnly,
    weekendOnly,
    remoteOnly,
    sortBy,
  ]);

  const availableSubcategories = useMemo(() => {
    if (!category) {
      return CATEGORIES.flatMap((c) => c.subcategories);
    }
    const found = CATEGORIES.find((c) => c.id === category);
    return found ? found.subcategories : [];
  }, [category]);

  const filteredAds = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    const list = advertisements.filter((ad) => {
      if (ad.status !== 'active') return false;
      if (category && ad.categoryId !== category) return false;
      if (subcategory && ad.subcategoryId !== subcategory) return false;
      if (location && ad.locationId !== location) return false;

      const effectivePrice =
        lang === 'fa' ? ad.price : ad.priceUsd || Math.round(ad.price / 50000);
      if (minPrice !== '' && effectivePrice < Number(minPrice)) return false;
      if (maxPrice !== '' && effectivePrice > Number(maxPrice)) return false;

      if (Number(minRating) > 0 && ad.rating < Number(minRating)) return false;
      if (Number(minExp) > 0 && (ad.experienceYears || 5) < Number(minExp)) return false;

      if (urgentOnly && !ad.urgentAvailable) return false;
      if (weekendOnly && !ad.weekendAvailable) return false;
      if (remoteOnly && !ad.remoteAvailable) return false;

      if (q) {
        const pro = professionals.find((p) => p.id === ad.proId);
        const haystack = [
          ad.title?.fa,
          ad.title?.en,
          ad.shortDesc?.fa,
          ad.shortDesc?.en,
          pro?.name?.fa,
          pro?.name?.en,
          ...(ad.skills || []).map((s) => `${s.fa} ${s.en}`),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return sorted;
  }, [
    advertisements,
    professionals,
    debouncedQuery,
    category,
    subcategory,
    location,
    minPrice,
    maxPrice,
    minRating,
    minExp,
    urgentOnly,
    weekendOnly,
    remoteOnly,
    sortBy,
    lang,
  ]);

  const handleResetFilters = () => {
    setQuery('');
    setCategory('');
    setSubcategory('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('0');
    setMinExp('0');
    setUrgentOnly(false);
    setWeekendOnly(false);
    setRemoteOnly(false);
    setSortBy('popular');
    setSearchParams({});
  };

  const visibleAds = filteredAds.slice(0, visibleCount);
  const hasActiveFilters =
    Boolean(query || category || subcategory || location || minPrice || maxPrice) ||
    Number(minRating) > 0 ||
    Number(minExp) > 0 ||
    urgentOnly ||
    weekendOnly ||
    remoteOnly;

  const filterFormContent = (
    <Stack spacing={2.2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <strong style={{ fontSize: '0.98rem' }}>
          {lang === 'fa' ? 'فیلتر دقیق نتایج' : 'Refine Results'}
        </strong>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#d94848',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <RotateCcw size={13} />
            <span>{lang === 'fa' ? 'پاک‌سازی' : 'Reset'}</span>
          </button>
        )}
      </Stack>

      <div className={styles.filterGroup}>
        <label className={styles.filterTitle}>
          {lang === 'fa' ? 'دسته‌بندی اصلی' : 'Category'}
        </label>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory('');
          }}
        >
          <option value="">{lang === 'fa' ? 'همه دسته‌بندی‌ها' : 'All Categories'}</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {l(c.name)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterTitle}>
          {lang === 'fa' ? 'زیردسته تخصصی' : 'Subcategory'}
        </label>
        <select
          className={styles.select}
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
        >
          <option value="">{lang === 'fa' ? 'همه زیردسته‌ها' : 'All Subcategories'}</option>
          {availableSubcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {l(sub.name)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterTitle}>
          {lang === 'fa' ? 'شهر / موقعیت' : 'Location'}
        </label>
        <select
          className={styles.select}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">{lang === 'fa' ? 'همه شهرها' : 'All Locations'}</option>
          {LOCATIONS.map((locItem) => (
            <option key={locItem.id} value={locItem.id}>
              {l(locItem.name)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterTitle}>
          {lang === 'fa' ? 'محدوده تعرفه (تومان)' : 'Price Range ($ USD)'}
        </label>
        <div className={styles.priceGrid}>
          <input
            type="number"
            min="0"
            className={styles.priceInput}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={lang === 'fa' ? 'حداقل' : 'Min'}
          />
          <input
            type="number"
            min="0"
            className={styles.priceInput}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={lang === 'fa' ? 'حداکثر' : 'Max'}
          />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterTitle}>
          {lang === 'fa' ? 'حداقل امتیاز' : 'Minimum Rating'}
        </label>
        <select
          className={styles.select}
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="0">{lang === 'fa' ? 'همه امتیازها' : 'Any Rating'}</option>
          <option value="4.5">★ 4.5+</option>
          <option value="4.8">★ 4.8+</option>
          <option value="4.95">★ 4.95+</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterTitle}>
          {lang === 'fa' ? 'سابقه تجربی متخصص' : 'Specialist Experience'}
        </label>
        <select
          className={styles.select}
          value={minExp}
          onChange={(e) => setMinExp(e.target.value)}
        >
          <option value="0">{lang === 'fa' ? 'هر میزان سابقه' : 'Any Experience'}</option>
          <option value="5">{lang === 'fa' ? '+۵ سال تجربه' : '5+ years'}</option>
          <option value="8">{lang === 'fa' ? '+۸ سال تجربه' : '8+ years'}</option>
          <option value="10">{lang === 'fa' ? '+۱۰ سال تجربه' : '10+ years'}</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterTitle}>
          {lang === 'fa' ? 'شرایط زمانی و دسترسی' : 'Availability'}
        </span>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={urgentOnly}
            onChange={(e) => setUrgentOnly(e.target.checked)}
          />
          <span>{lang === 'fa' ? 'اعزام / پاسخ فوری' : 'Express / Urgent Available'}</span>
        </label>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={weekendOnly}
            onChange={(e) => setWeekendOnly(e.target.checked)}
          />
          <span>{lang === 'fa' ? 'فعال در پایان هفته' : 'Weekend Availability'}</span>
        </label>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={(e) => setRemoteOnly(e.target.checked)}
          />
          <span>{lang === 'fa' ? 'امکان ارائه آنلاین / دورکاری' : 'Remote Service Option'}</span>
        </label>
      </div>
    </Stack>
  );

  return (
    <PageTransition>
      <section className={styles.heroHeader}>
        <Container maxWidth="xl">
          <span className="owj-section-tag owj-section-tag--dark">
            {lang === 'fa' ? 'کاوش بازارگاه خدمات' : 'Explore Marketplace'}
          </span>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)',
              fontWeight: 900,
              marginTop: '0.65rem',
            }}
          >
            {lang === 'fa'
              ? 'کشف برترین متخصصان و خدمات حرفه‌ای'
              : 'Discover verified specialists & tailored services'}
          </h1>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2.5 }}>
            <div className={styles.searchInputWrap} style={{ flex: 1 }}>
              <Search size={18} color="#464841" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  lang === 'fa'
                    ? 'جستجو بر اساس عنوان خدمت، مهارت یا نام متخصص...'
                    : 'Search by service title, skill, or specialist name...'
                }
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </div>

            {hasToken && isProfessional && (
              <button
                type="button"
                onClick={() => openSkillRequestModal()}
                className="owj-btn owj-btn--outline-light"
              >
                <Sparkles size={16} color="#C7F36B" />
                <span>{lang === 'fa' ? 'درخواست مهارت' : 'Request a Skill'}</span>
              </button>
            )}

            {isCompact && (
              <button
                type="button"
                className="owj-btn owj-btn--lime"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal size={16} />
                <span>{lang === 'fa' ? 'فیلترهای پیشرفته' : 'Filters'}</span>
              </button>
            )}
          </Stack>
        </Container>
      </section>

      <Container maxWidth="xl" sx={{ py: { xs: 3.5, md: 5 } }}>
        <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="flex-start">
          {/* Desktop Sticky Filter Sidebar */}
          {!isCompact && (
            <Grid size={{ lg: 3.1 }}>
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid rgba(17,18,15,0.08)',
                  p: 2.5,
                  position: 'sticky',
                  top: 90,
                }}
              >
                {filterFormContent}
              </Box>
            </Grid>
          )}

          {/* Responsive Results Column */}
          <Grid size={{ xs: 12, lg: 8.9 }}>
            <div className={styles.toolbar}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {formatNumber(filteredAds.length, lang)}{' '}
                {lang === 'fa' ? 'خدمت تخصصی یافت شد' : 'services found'}
              </div>

              <Stack direction="row" spacing={1.2} alignItems="center" flexWrap="wrap">
                <select
                  className={styles.select}
                  style={{ width: 'auto', paddingBlock: '0.48rem' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort results"
                >
                  <option value="popular">
                    {lang === 'fa' ? 'مرتب‌سازی: محبوب‌ترین' : 'Sort: Popularity'}
                  </option>
                  <option value="newest">
                    {lang === 'fa' ? 'مرتب‌سازی: جدیدترین' : 'Sort: Newest'}
                  </option>
                  <option value="rating">
                    {lang === 'fa' ? 'مرتب‌سازی: بالاترین امتیاز' : 'Sort: Highest Rated'}
                  </option>
                  <option value="price-asc">
                    {lang === 'fa' ? 'تعرفه: کم به زیاد' : 'Price: Low to High'}
                  </option>
                  <option value="price-desc">
                    {lang === 'fa' ? 'تعرفه: زیاد به کم' : 'Price: High to Low'}
                  </option>
                </select>

                <div className={styles.viewToggle}>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.activeView : ''}`}
                    aria-label="Grid View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`${styles.viewBtn} ${viewMode === 'list' ? styles.activeView : ''}`}
                    aria-label="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </Stack>
            </div>

            {hasActiveFilters && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {category && (
                  <Chip
                    label={l(getCategoryById(category).name)}
                    onDelete={() => setCategory('')}
                    color="primary"
                    size="small"
                  />
                )}
                {location && (
                  <Chip
                    label={l(getLocationById(location).name)}
                    onDelete={() => setLocation('')}
                    color="primary"
                    size="small"
                  />
                )}
                {urgentOnly && (
                  <Chip
                    label={lang === 'fa' ? 'فوری' : 'Express'}
                    onDelete={() => setUrgentOnly(false)}
                    color="primary"
                    size="small"
                  />
                )}
              </Stack>
            )}

            {isFiltering ? (
              <Grid container spacing={2.5}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <Grid key={n} size={{ xs: 12, sm: 6, xl: 4 }}>
                    <SkeletonCard />
                  </Grid>
                ))}
              </Grid>
            ) : filteredAds.length === 0 ? (
              <div className={styles.emptyBox}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {lang === 'fa'
                    ? 'خدمتی با این ترکیب فیلتر یافت نشد'
                    : 'No services match these exact filters'}
                </h3>
                <p style={{ color: '#666860', maxWidth: 420, fontSize: '0.9rem' }}>
                  {lang === 'fa'
                    ? 'پیشنهاد می‌کنیم محدوده قیمت را بازتر کنید یا برخی فیلترها را پاک نمایید.'
                    : 'Try broadening your price range, switching location, or clearing active filters.'}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="owj-btn owj-btn--lime"
                >
                  {lang === 'fa' ? 'پاک‌سازی همه فیلترها' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              <>
                <Grid container spacing={2.5}>
                  {visibleAds.map((ad) => (
                    <Grid
                      key={ad.id}
                      size={
                        viewMode === 'list' ? { xs: 12 } : { xs: 12, sm: 6, xl: 4 }
                      }
                    >
                      <ServiceCard ad={ad} viewMode={viewMode} />
                    </Grid>
                  ))}
                </Grid>

                {visibleCount < filteredAds.length && (
                  <div className={styles.paginationRow}>
                    <button
                      type="button"
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="owj-btn owj-btn--dark"
                    >
                      {lang === 'fa'
                        ? `نمایش آگهی‌های بیشتر (${formatNumber(
                            filteredAds.length - visibleCount,
                            lang
                          )} باقی‌مانده)`
                        : `Load More (${filteredAds.length - visibleCount} remaining)`}
                    </button>
                  </div>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile / Tablet MUI Filter Drawer */}
      <Drawer
        anchor={isRTL ? 'right' : 'left'}
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '88vw', sm: 360 },
            bgcolor: '#FFFFFF',
            p: 2.5,
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <strong style={{ fontSize: '1.05rem' }}>
            {lang === 'fa' ? 'فیلترهای جستجو' : 'Search Filters'}
          </strong>
          <IconButton onClick={() => setMobileFiltersOpen(false)} size="small">
            <X size={18} />
          </IconButton>
        </Stack>
        {filterFormContent}
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(false)}
          className="owj-btn owj-btn--lime"
          style={{ width: '100%', marginTop: '1.5rem' }}
        >
          {lang === 'fa'
            ? `مشاهده ${formatNumber(filteredAds.length, lang)} نتیجه`
            : `Show ${filteredAds.length} Results`}
        </button>
      </Drawer>
    </PageTransition>
  );
}
