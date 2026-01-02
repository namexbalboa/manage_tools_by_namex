export const avatarOptions = {
  head: [
    { id: 'boy_1', label: 'Menino 1', path: '/avatars/head/boy_1.png' },
    { id: 'boy_2', label: 'Menino 2', path: '/avatars/head/boy_2.png' },
    { id: 'boy_4', label: 'Menino 4', path: '/avatars/head/boy_4.png' },
    { id: 'boy_5', label: 'Menino 5', path: '/avatars/head/boy_5.png' },
    { id: 'boy_6', label: 'Menino 6', path: '/avatars/head/boy_6.png' },
    { id: 'girl_1', label: 'Menina 1', path: '/avatars/head/girl_1.png' },
    { id: 'girl_2', label: 'Menina 2', path: '/avatars/head/girl_2.png' },
    { id: 'girl_5', label: 'Menina 5', path: '/avatars/head/girl_5.png' },
    { id: 'girl_6', label: 'Menina 6', path: '/avatars/head/girl_6.png' },
  ],
  body: [
    { id: 'body_boy_1', label: 'Corpo Menino 1', path: '/avatars/body/body_boy_1.png' },
    { id: 'body_boy_2', label: 'Corpo Menino 2', path: '/avatars/body/body_boy_2.png' },
    { id: 'body_boy_3', label: 'Corpo Menino 3', path: '/avatars/body/body_boy_3.png' },
    { id: 'body_girl_1', label: 'Corpo Menina 1', path: '/avatars/body/body_girl_1.png' },
    { id: 'body_girl_2', label: 'Corpo Menina 2', path: '/avatars/body/body_girl_2.png' },
    { id: 'body_girl_3', label: 'Corpo Menina 3', path: '/avatars/body/body_girl_3.png' },
  ],
}

export const getAvatarPath = (part: 'head' | 'body', id: string): string | null => {
  const option = avatarOptions[part].find((opt) => opt.id === id)
  return option?.path || null
}
