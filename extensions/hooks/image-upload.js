export default function registerHook({ action }, { services, env }) {
  const { ItemsService } = services;

  action('files.upload', async ({ payload }, { schema, accountability }) => {
    console.log('🔥 Hook triggered for file:', payload.filename_download);

    const imagesService = new ItemsService('images', { schema, accountability });
    const created = await imagesService.createOne({
      name: payload.title || payload.filename_download,
      content_type: payload.type,
      minio_bucket: env.STORAGE_S3_BUCKET,
      minio_object_key: payload.filename_disk,
      minio_url: `${env.STORAGE_S3_ENDPOINT}/${env.STORAGE_S3_BUCKET}/${payload.filename_disk}`,
    });

    console.log('✅ Image record created:', created);
  });
}