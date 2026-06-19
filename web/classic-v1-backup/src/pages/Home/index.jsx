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
import { Typography } from '@douyinfe/semi-ui';
import { API, showError } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons';

const { Text } = Typography;

const PROVIDER_LOGO_SIZE = 44;

const providerLogosRow1 = [
  { name: 'Moonshot', icon: <Moonshot size={PROVIDER_LOGO_SIZE} /> },
  { name: 'OpenAI', icon: <OpenAI size={PROVIDER_LOGO_SIZE} /> },
  { name: 'XAI', icon: <XAI size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Zhipu', icon: <Zhipu.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Volcengine', icon: <Volcengine.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Cohere', icon: <Cohere.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Claude', icon: <Claude.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Gemini', icon: <Gemini.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Suno', icon: <Suno size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Minimax', icon: <Minimax.Color size={PROVIDER_LOGO_SIZE} /> },
];

const providerLogosRow2 = [
  { name: 'Wenxin', icon: <Wenxin.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Spark', icon: <Spark.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Qingyan', icon: <Qingyan.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'DeepSeek', icon: <DeepSeek.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Qwen', icon: <Qwen.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Midjourney', icon: <Midjourney size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Grok', icon: <Grok size={PROVIDER_LOGO_SIZE} /> },
  { name: 'AzureAI', icon: <AzureAI.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Hunyuan', icon: <Hunyuan.Color size={PROVIDER_LOGO_SIZE} /> },
  { name: 'Xinference', icon: <Xinference.Color size={PROVIDER_LOGO_SIZE} /> },
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();

  const renderProviderLogoItem = (provider, index, duplicateIndex = 0) => (
    <div
      key={`${provider.name}-${duplicateIndex}-${index}`}
      className={`provider-logo-item ${duplicateIndex > 0 ? 'provider-logo-item-duplicate' : ''}`}
      title={provider.name}
      aria-hidden={duplicateIndex > 0}
    >
      {provider.icon}
    </div>
  );

  const renderProviderMarqueeRow = (providers, directionClass) => (
    <div className={`provider-marquee-row ${directionClass}`}>
      <div className='provider-marquee-track'>
        {providers.map((provider, index) =>
          renderProviderLogoItem(provider, index),
        )}
        {providers.map((provider, index) =>
          renderProviderLogoItem(provider, index, 1),
        )}
      </div>
    </div>
  );

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
            <div className='flex items-center justify-center px-4 pt-24 pb-8'>
              {/* 居中内容区 */}
              <div className='flex flex-col items-center justify-center text-center max-w-6xl mx-auto w-full'>
                <section className='hero-code-showcase'>
                  <div className='hero-badge'>
                    {t('OpenAI Compatible Gateway')}
                  </div>
                  <h1>{t('一个 API，连接所有模型')}</h1>
                  <p>
                    {t(
                      '统一接入模型渠道、密钥、用量与调用日志，为团队提供稳定的大模型访问层。',
                    )}
                  </p>

                  <div className='gateway-visual' aria-hidden='true'>
                    <div className='gateway-glass-card code-card'>
                      <div className='code-card-header'>
                        <div className='window-dots'>
                          <span className='window-dot window-dot-red' />
                          <span className='window-dot window-dot-yellow' />
                          <span className='window-dot window-dot-green' />
                        </div>
                        <span>{t('Request')}</span>
                      </div>
                      <pre className='code-block'>
                        <code>
                          <span className='code-keyword'>const</span>{' '}
                          <span className='code-variable'>client</span>{' '}
                          <span className='code-operator'>=</span>{' '}
                          <span className='code-keyword'>new</span>{' '}
                          <span className='code-class'>OpenAI</span>
                          <span className='code-punctuation'>({'{'}</span>
                          {'\n  '}
                          <span className='code-property'>baseURL</span>
                          <span className='code-punctuation'>:</span>{' '}
                          <span className='code-string'>
                            "https://api.yourdomain.com/v1"
                          </span>
                          <span className='code-punctuation'>,</span>
                          {'\n  '}
                          <span className='code-property'>apiKey</span>
                          <span className='code-punctuation'>:</span>{' '}
                          <span className='code-variable'>process</span>
                          <span className='code-punctuation'>.</span>
                          <span className='code-property'>env</span>
                          <span className='code-punctuation'>.</span>
                          <span className='code-property'>NEW_API_KEY</span>
                          {'\n'}
                          <span className='code-punctuation'>{'});'}</span>
                          {'\n\n'}
                          <span className='code-keyword'>const</span>{' '}
                          <span className='code-variable'>res</span>{' '}
                          <span className='code-operator'>=</span>{' '}
                          <span className='code-keyword'>await</span>{' '}
                          <span className='code-variable'>client</span>
                          <span className='code-punctuation'>.</span>
                          <span className='code-property'>chat</span>
                          <span className='code-punctuation'>.</span>
                          <span className='code-property'>completions</span>
                          <span className='code-punctuation'>.</span>
                          <span className='code-property'>create</span>
                          <span className='code-punctuation'>({'{'}</span>
                          {'\n  '}
                          <span className='code-property'>model</span>
                          <span className='code-punctuation'>:</span>{' '}
                          <span className='code-string'>"gpt-4o"</span>
                          <span className='code-punctuation'>,</span>
                          {'\n  '}
                          <span className='code-property'>messages</span>
                          <span className='code-punctuation'>:</span>{' '}
                          <span className='code-punctuation'>[</span>
                          {'\n    '}
                          <span className='code-punctuation'>{'{ '}</span>
                          <span className='code-property'>role</span>
                          <span className='code-punctuation'>:</span>{' '}
                          <span className='code-string'>"user"</span>
                          <span className='code-punctuation'>, </span>
                          <span className='code-property'>content</span>
                          <span className='code-punctuation'>:</span>{' '}
                          <span className='code-string'>"Hello, New API"</span>
                          <span className='code-punctuation'> {'}'}</span>
                          {'\n  '}
                          <span className='code-punctuation'>]</span>
                          {'\n'}
                          <span className='code-punctuation'>{'});'}</span>
                        </code>
                      </pre>
                    </div>

                    <div className='flow-line'>
                      <span className='flow-dot' />
                    </div>

                    <div className='gateway-glass-card response-card'>
                      <div className='response-card-header'>
                        <span>{t('Gateway Response')}</span>
                        <span className='response-status'>
                          <span className='response-status-dot' />
                          success
                        </span>
                      </div>
                      <pre className='response-json'>
                        <code>
                          <span className='code-punctuation'>{'{'}</span>
                          {'\n  '}
                          <span className='code-property'>"provider"</span>
                          <span className='code-punctuation'>: </span>
                          <span className='code-string'>"auto"</span>
                          <span className='code-punctuation'>,</span>
                          {'\n  '}
                          <span className='code-property'>"model"</span>
                          <span className='code-punctuation'>: </span>
                          <span className='code-string'>"gpt-4o"</span>
                          <span className='code-punctuation'>,</span>
                          {'\n  '}
                          <span className='code-property'>"status"</span>
                          <span className='code-punctuation'>: </span>
                          <span className='code-string'>"success"</span>
                          <span className='code-punctuation'>,</span>
                          {'\n  '}
                          <span className='code-property'>"latency"</span>
                          <span className='code-punctuation'>: </span>
                          <span className='code-string'>"328ms"</span>
                          <span className='code-punctuation'>,</span>
                          {'\n  '}
                          <span className='code-property'>"usage"</span>
                          <span className='code-punctuation'>: </span>
                          <span className='code-string'>"tracked"</span>
                          {'\n'}
                          <span className='code-punctuation'>{'}'}</span>
                        </code>
                      </pre>
                      <div className='gateway-capabilities'>
                        <span>{t('Auto Routing')}</span>
                        <span>{t('Key Managed')}</span>
                        <span>{t('Usage Logged')}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 框架兼容性图标 */}
                <div className='mt-10 md:mt-12 lg:mt-14 w-full'>
                  <div className='flex items-center mb-6 md:mb-8 justify-center'>
                    <Text
                      type='tertiary'
                      className='text-lg md:text-xl lg:text-2xl font-light'
                    >
                      {t('支持众多的大模型供应商')}
                    </Text>
                  </div>
                  <div className='provider-marquee'>
                    <div className='provider-marquee-mask'>
                      {renderProviderMarqueeRow(
                        providerLogosRow1,
                        'provider-row-right',
                      )}
                      {renderProviderMarqueeRow(
                        providerLogosRow2,
                        'provider-row-left',
                      )}
                    </div>
                  </div>
                </div>
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
