import * as ImageManipulator from 'expo-image-manipulator';

const MAX_LARGURA = 1200;

export async function prepararImagemProduto(
  uri: string,
): Promise<{ uri: string; mimeType: string }> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_LARGURA } }],
    {
      compress: 0.82,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  return {
    uri: result.uri,
    mimeType: 'image/jpeg',
  };
}

export const NOME_PRODUTO_MAX = 300;
