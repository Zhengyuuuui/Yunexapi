/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import NoticeModal from '../../components/layout/NoticeModal';

const motionHeroImages = [
  '/motion/Claude.png',
  '/motion/deepseek.webp',
  '/motion/gemini.webp',
  '/motion/zai.webp',
];

const motionOrbDots = [
  [278.6, 331.9, 16.4, [221, 201, 189]],
  [283.8, 293.3, 17.4, [222, 188, 178]],
  [300.1, 256.7, 17.4, [225, 174, 174]],
  [325, 225.8, 17.9, [219, 161, 171]],
  [357.3, 203.2, 17.9, [219, 146, 162]],
  [394.7, 190.2, 17.9, [212, 135, 154]],
  [434.3, 187.6, 18.8, [211, 132, 151]],
  [473, 196.2, 16.9, [209, 124, 151]],
  [508.1, 213, 15.5, [200, 120, 166]],
  [539.8, 241.4, 14.6, [191, 114, 173]],
  [557.4, 275.6, 17.9, [183, 118, 185]],
  [567.6, 313.7, 17.9, [179, 112, 200]],
  [567.5, 353.6, 17.4, [176, 116, 210]],
  [556.5, 391.4, 18.3, [160, 133, 205]],
  [536.1, 425.5, 17.9, [161, 150, 220]],
  [506.7, 452.1, 16.9, [163, 160, 221]],
  [471.5, 470, 16.4, [157, 178, 228]],
  [432.7, 478.1, 16.9, [154, 190, 227]],
  [393.4, 475.2, 16.9, [161, 195, 227]],
  [356.3, 461.7, 16.9, [180, 196, 214]],
  [323.7, 438.6, 16.9, [190, 196, 201]],
  [299.1, 407.7, 16.4, [198, 196, 198]],
  [283.3, 371.4, 16.4, [211, 200, 193]],
  [250.7, 310, 23.5, [228, 192, 176]],
  [226.7, 280.8, 21.6, [224, 187, 182]],
  [263.4, 264.2, 23.5, [225, 178, 174]],
  [248.8, 229.8, 21.2, [221, 172, 174]],
  [288.3, 223.2, 24.9, [226, 162, 158]],
  [282.8, 186.1, 21.2, [221, 160, 161]],
  [322.3, 190.7, 24.9, [223, 156, 155]],
  [327.4, 153.5, 21.6, [220, 149, 160]],
  [364.1, 168.7, 24, [221, 138, 150]],
  [379.1, 134.3, 21.6, [216, 135, 150]],
  [410.9, 158.8, 24.9, [219, 127, 149]],
  [434.5, 129.5, 22.1, [218, 123, 146]],
  [458.2, 161.9, 25.4, [213, 122, 144]],
  [489, 140.1, 21.6, [208, 121, 150]],
  [503.2, 177.4, 26.3, [203, 118, 155]],
  [538.4, 164.9, 20.7, [200, 119, 161]],
  [542.2, 204.7, 25.8, [200, 114, 168]],
  [579.3, 202.1, 21.6, [195, 113, 174]],
  [572.1, 241.5, 24, [195, 110, 188]],
  [609.2, 248.9, 21.6, [190, 111, 189]],
  [591.2, 285.1, 25.8, [187, 110, 196]],
  [624.9, 302.1, 21.6, [181, 109, 201]],
  [598.1, 331.9, 25.4, [178, 108, 207]],
  [625.7, 357.7, 21.6, [176, 112, 210]],
  [591.9, 379.2, 25.8, [169, 119, 217]],
  [611.4, 411.3, 21.2, [167, 130, 215]],
  [573, 422.9, 25.4, [161, 135, 216]],
  [583, 459, 21.6, [156, 144, 220]],
  [543.2, 460, 25.4, [161, 152, 231]],
  [543.4, 497.6, 21.6, [163, 158, 225]],
  [504.7, 487.6, 24.4, [159, 163, 231]],
  [494.6, 523.8, 21.6, [158, 173, 233]],
  [459.8, 503.7, 24, [153, 184, 232]],
  [440.4, 535.7, 20.7, [150, 190, 237]],
  [412.6, 507, 24.9, [153, 194, 240]],
  [385.1, 532.9, 21.2, [156, 193, 228]],
  [365.9, 497.6, 24, [168, 194, 226]],
  [332.6, 514.9, 21.2, [173, 194, 218]],
  [323.6, 475.8, 24, [184, 195, 210]],
  [287.2, 483.8, 20.2, [188, 196, 208]],
  [288.9, 443.7, 24, [196, 195, 201]],
  [251.4, 441.3, 20.7, [198, 198, 198]],
  [263.9, 403.1, 23.5, [203, 195, 196]],
  [228.7, 390.7, 19.7, [209, 198, 194]],
  [251, 357.4, 24, [217, 197, 188]],
  [220.5, 335.7, 20.7, [226, 197, 180]],
  [192.7, 306.8, 31.5, [227, 192, 174]],
  [208.1, 245.5, 31.5, [225, 178, 171]],
  [239.6, 190.6, 32, [223, 164, 165]],
  [285, 145.9, 32, [224, 153, 156]],
  [340.4, 115.4, 32.4, [224, 141, 156]],
  [402.1, 101.1, 32.4, [221, 125, 147]],
  [465.4, 104, 32.4, [218, 121, 145]],
  [525.5, 123.6, 32.4, [211, 117, 156]],
  [578.1, 159, 31.5, [204, 115, 170]],
  [619.5, 207.3, 32.9, [196, 111, 186]],
  [645.8, 264.8, 32.9, [186, 107, 198]],
  [656, 327.3, 33.4, [183, 104, 213]],
  [648.8, 390.1, 32.9, [172, 119, 222]],
  [625.2, 448.9, 32.4, [164, 135, 227]],
  [586.2, 499.1, 32.4, [159, 148, 225]],
  [535.5, 536.9, 32, [159, 166, 233]],
  [476.5, 559.4, 32, [149, 182, 238]],
  [413.4, 565.2, 31.5, [148, 195, 239]],
  [351, 553.9, 31.5, [163, 197, 227]],
  [294.4, 526.2, 30.6, [178, 195, 214]],
  [246.9, 484, 31, [193, 193, 202]],
  [212.8, 430.8, 32, [202, 197, 195]],
  [194.1, 369.9, 32, [219, 195, 183]],
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [activeOrbIndex, setActiveOrbIndex] = useState(0);
  const [activeHeroImageIndex, setActiveHeroImageIndex] = useState(0);
  const isMobile = useIsMobile();

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOrbIndex((index) => (index + 17) % motionOrbDots.length);
      setActiveHeroImageIndex((index) => index + 1);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className='classic-page-fill classic-home-page w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='classic-home-default w-full overflow-x-hidden'>
          {/* Banner 部分 */}
          <div className='classic-home-hero w-full border-b border-semi-color-border relative overflow-x-hidden'>
            {/* 背景模糊晕染球 */}
            <div className='blur-ball blur-ball-indigo' />
            <div className='blur-ball blur-ball-teal' />
            <div className='flex items-center justify-center px-4 py-10 md:py-12 min-h-[calc(100dvh-64px)]'>
              {/* 居中内容区 */}
              <div className='flex flex-col items-center justify-center text-center max-w-6xl mx-auto w-full'>
                <section className='motion-hero-showcase'>
                  <div
                    className='motion-hero-stage'
                    aria-label={t('一个 API，连接所有模型')}
                  >
                    <div className='motion-hero-scene' aria-hidden='true'>
                      <div className='motion-orb-field'>
                        {motionOrbDots.map(([x, y, size, rgb], index) => {
                          const isActive = index === activeOrbIndex;
                          return (
                            <i
                              key={`${x}-${y}-${size}-${index}`}
                              className={`motion-orb-shell ${isActive ? 'is-active' : ''}`}
                              style={{
                                left: `${((x / 854) * 100).toFixed(3)}%`,
                                top: `${((y / 624) * 100).toFixed(3)}%`,
                                '--orb-size': `${((size / 854) * 100).toFixed(3)}%`,
                                '--orb-color': `rgb(${rgb.join(',')})`,
                                '--orb-scale': `${Math.max(3.8, 124 / size)}`,
                              }}
                            >
                              <span className='motion-orb'>
                                {isActive && (
                                  <img
                                    src={
                                      motionHeroImages[
                                        activeHeroImageIndex %
                                          motionHeroImages.length
                                      ]
                                    }
                                    alt=''
                                  />
                                )}
                              </span>
                            </i>
                          );
                        })}
                      </div>
                      <div className='motion-center-logo'>
                        <img src='/motion/logo.png' alt='' />
                      </div>
                    </div>
                    <div className='motion-hero-copy'>
                      <div className='motion-hero-badge'>
                        {t('OpenAI Compatible Gateway')}
                      </div>
                      <h1>{t('一个 API，连接所有模型')}</h1>
                      <p>
                        {t(
                          '统一接入模型渠道、密钥、用量与调用日志，为团队提供稳定的大模型访问层。',
                        )}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='classic-page-fill overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-full border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
