import ImagesGallery from '../ImagesGallery'
import { getImageFiles, paginateImages } from '../image-data'


export default async function ImagesPagedPage({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const files = await getImageFiles()
  const { page } = await params
  const pageNumber = Number.parseInt(page, 10)
  const { currentPage, totalPages, totalImages, pagedFiles } = paginateImages(
    files,
    Number.isNaN(pageNumber) ? 1 : pageNumber,
  )

  return (
    <ImagesGallery
      files={pagedFiles}
      currentPage={currentPage}
      totalPages={totalPages}
      totalImages={totalImages}
    />
  )
}
