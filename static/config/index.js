/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'http://localhost:8080/renren-fast'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './'
  window.SITE_CONFIG['version'] = ''
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
