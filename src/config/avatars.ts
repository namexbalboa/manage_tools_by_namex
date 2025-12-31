export const avatarOptions = {
  head: [
    { id: 'none', label: 'Sem acessório', path: null },
    { id: 'cap', label: 'Boné', path: '/avatars/head/cap.png' },
    { id: 'crown', label: 'Coroa', path: '/avatars/head/crown.png' },
    { id: 'hat', label: 'Chapéu', path: '/avatars/head/hat.png' },
    { id: 'headphones', label: 'Fone', path: '/avatars/head/headphones.png' },
  ],
  body: [
    { id: 'default', label: 'Padrão', path: '/avatars/body/default.png' },
    { id: 'suit', label: 'Terno', path: '/avatars/body/suit.png' },
    { id: 'shirt', label: 'Camisa', path: '/avatars/body/shirt.png' },
    { id: 'jacket', label: 'Jaqueta', path: '/avatars/body/jacket.png' },
    { id: 'hoodie', label: 'Moletom', path: '/avatars/body/hoodie.png' },
  ],
}

export const getAvatarPath = (part: 'head' | 'body', id: string): string | null => {
  const option = avatarOptions[part].find((opt) => opt.id === id)
  return option?.path || null
}
