import ImagesGallery from './ImagesGallery'
import { getImageFiles, paginateImages } from './image-data'

export default async function ImagesPage() {
  const files = await getImageFiles()
  const { currentPage, totalPages, totalImages, pagedFiles } = paginateImages(files, 1)

  return (
    <ImagesGallery
      files={pagedFiles}
      currentPage={currentPage}
      totalPages={totalPages}
      totalImages={totalImages}
    />
  )
}
