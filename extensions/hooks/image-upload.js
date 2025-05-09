export default function registerHook({ action }, { services, getSchema, env }) {
    const { ItemsService } = services;
  
    action('files.upload', async ({ payload }, { schema, accountability }) => {
      const fileId = payload.id;
      const filename = payload.filename_disk;
      const mimeType = payload.type;
  
      const bucket = env['STORAGE_FILES_BUCKET'];
      const endpoint = env['STORAGE_FILES_ENDPOINT'];
      const objectKey = filename;
      const url = `${endpoint}/${bucket}/${objectKey}`;
  
      const imagesService = new ItemsService('images', { schema, accountability });
  
      const imageRecord = await imagesService.createOne({
        name: payload.title || filename,
        content_type: mimeType,
        minio_bucket: bucket,
        minio_object_key: objectKey,
        minio_url: url,
      });
  
      const metadata = payload.metadata || {};
      const restaurantId = metadata.restaurant_id;
      const menuItemId = metadata.menu_item_id;
  
      if (restaurantId) {
        const restaurantImages = new ItemsService('restaurant_images', { schema, accountability });
        await restaurantImages.createOne({
          restaurant_id: restaurantId,
          image_id: imageRecord.id,
        });
      } else if (menuItemId) {
        const menuItemImages = new ItemsService('menu_item_images', { schema, accountability });
        await menuItemImages.createOne({
          menu_item_id: menuItemId,
          image_id: imageRecord.id,
        });
      }
    });
  }
  