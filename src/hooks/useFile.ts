import type { UploaderFileListItem } from 'vant'
import OSS from 'ali-oss'
import axios from 'axios'
import { closeToast, showLoadingToast } from 'vant'
import { useVideoCover } from './useVideoCover'

type stsTypeData = {
  AccessKeyId: string
  AccessKeySecret: string
  Expiration: string
  SecurityToken: string
  bucket: string
  cdnUrl: string
  host: string
}

/** 上传成功回调类型 */
type UploadSuccessCallback = (url: string) => void

/** 获取对应文件并上传 */
export const useFile = (cb?: UploadSuccessCallback) => {
  const { extractCoverFromVideo } = useVideoCover()

  let fileInput: HTMLInputElement | null = null
  const stsData = ref<stsTypeData>()
  /** 图片链接 */
  const imgUrl = ref('')

  /**
   * 获取 STS 临时凭证
   */
  const getSTS = async () => {
    showLoadingToast({
      message: 'Loading...',
      forbidClick: true
    })
    const res = await axios.get('https://api.wouldbeauty.com/sts/getkey')
    stsData.value = res.data.result
    closeToast()
    return res.data.result
  }

  /** 上传到 OSS */
  const uploadToOSS = async (item: UploaderFileListItem) => {
    if (!item.file) {
      item.status = 'failed'
      item.message = '文件不存在'
      throw new Error('文件不存在')
    }

    // 设置上传状态
    item.status = 'uploading'
    item.message = 'Uploading...'
    const file = item.file

    // 确保 STS 凭证已获取
    let sts: stsTypeData = stsData.value
    if (!sts) {
      sts = await getSTS()
    }

    if (!sts || !sts.host || !sts.bucket) {
      item.status = 'failed'
      item.message = 'STS 凭证获取失败'
      throw new Error('STS 凭证获取失败')
    }

    const [https, endpoint] = sts.host.split(`${sts.bucket}.`)
    const client = new OSS({
      accessKeyId: sts.AccessKeyId,
      accessKeySecret: sts.AccessKeySecret,
      stsToken: sts.SecurityToken,
      bucket: sts.bucket,
      endpoint,
      // 自动刷新 STS Token
      refreshSTSToken: async () => {
        const resp = await getSTS()
        return {
          accessKeyId: resp.AccessKeyId,
          accessKeySecret: resp.AccessKeySecret,
          stsToken: resp.SecurityToken
        }
      },
      refreshSTSTokenInterval: 900000 // 15分钟
    })

    try {
      // 判断是否是视频
      if (file.type.startsWith('video/')) {
        const videoKey = `template_development/${Date.now()}_${file.name}`

        // 方案1：先上传视频，封面异步生成（更可靠）
        console.log('开始上传视频:', file.name)
        const videoRes = await client.put(videoKey, file)
        const videoUrl = videoRes.url.replace(/^http:\/\//, https)
        console.log('视频上传成功:', videoUrl)

        // 设置视频 URL
        item.url = videoUrl
        item.status = 'done' // 使用 'done' 而不是空字符串
        item.message = ''

        // 异步生成并上传封面（不阻塞主流程）
        extractCoverFromVideo(file)
          .then(coverBlob => {
            if (coverBlob) {
              // 将 Blob 转换为 File 对象用于上传
              const coverFile = new File([coverBlob], 'cover.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              const coverKey = `template_development/${Date.now()}_${coverFile.name}`
              return client.put(coverKey, coverFile)
            }
            return null
          })
          .then(coverResult => {
            if (coverResult) {
              const coverUrl = coverResult.url.replace(/^http:\/\//, https)
              item.objectUrl = coverUrl
              console.log('=== 视频上传信息 ===')
              console.log('视频 URL:', item.url)
              console.log('视频封面路径 (objectUrl):', item.objectUrl)
              console.log('封面上传成功:', coverUrl)
            } else {
              // 如果封面生成失败，使用视频 URL 作为预览
              item.objectUrl = videoUrl
              console.log('=== 视频上传信息 ===')
              console.log('视频 URL:', item.url)
              console.log('视频封面路径 (objectUrl):', item.objectUrl)
              console.warn('封面生成失败，使用视频 URL 作为预览')
            }
          })
          .catch(err => {
            console.warn('封面生成失败，使用视频 URL 作为预览:', err)
            item.objectUrl = videoUrl
            console.log('=== 视频上传信息 ===')
            console.log('视频 URL:', item.url)
            console.log('视频封面路径 (objectUrl):', item.objectUrl)
          })

        // 调试打印视频封面路径（初始状态）
        console.log('=== 视频上传信息 ===')
        console.log('视频 URL:', item.url)
        console.log('视频封面路径 (objectUrl):', item.objectUrl || '生成中...')
        console.log('完整 item 对象:', JSON.stringify({
          url: item.url,
          objectUrl: item.objectUrl || '生成中...',
          status: item.status,
          message: item.message
        }, null, 2))

        return videoUrl
      } else {
        // 图片上传
        const key = `template_development/${Date.now()}_${file.name}`
        const result = await client.put(key, file)
        item.status = 'done'
        item.message = ''
        return result.url.replace(/^http:\/\//, https)
      }
    } catch (err) {
      console.error('上传失败:', err)
      item.status = 'failed'
      item.message = '上传失败'
      throw err
    }
  }

  const createFileInput = (): HTMLInputElement => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.style.display = 'none'
    document.body.appendChild(input)
    return input
  }

  const pickImage = (): Promise<File | null> => {
    return new Promise(resolve => {
      // 确保 input 存在
      if (!fileInput) {
        fileInput = createFileInput()
      }

      // 每次选择前清空 value，确保重复选择同一文件也能触发 change
      fileInput.value = ''

      // 监听 change 事件
      const onChange = (event: Event) => {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0] || null

        // 可选：校验是否为图片
        if (file && !file.type.startsWith('image/')) {
          resolve(null)
          return
        }

        resolve(file)

        // 清理事件监听（避免内存泄漏）
        fileInput?.removeEventListener('change', onChange)
      }

      fileInput.addEventListener('change', onChange)

      // 触发点击
      fileInput.click()
    })
  }

  /** 点击元素触发文件选择 */
  const clickElement = async () => {
    const file = await pickImage()
    if (file) {
      const data: UploaderFileListItem = {
        file,
        status: '',
        message: ''
      }
      uploadToOSS(data).then(url => {
        imgUrl.value = url
        cb?.(url)
      })
    } else {
      console.log('未选择有效图片')
    }
  }

  onMounted(() => {
    getSTS()
  })

  // 页面卸载时清理 input 元素
  onUnmounted(() => {
    if (fileInput) {
      document.body.removeChild(fileInput)
      fileInput = null
    }
  })

  return {
    imgUrl,
    clickElement,
    uploadToOSS
  }
}
