Berikut adalah beberapa cara yang bisa digunakan untuk menambahkan atau menghapus teman, beserta kelebihan dan kekurangannya:

1. **Menggunakan `findIndex` dan `splice`:**

```typescript
router.put("/user/:id/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendId = mongoose.Types.ObjectId(req.params.friendId);
    const index = user.friends.findIndex((id) => id.equals(friendId));

    if (index === -1) {
      user.friends.push(friendId);
    } else {
      user.friends.splice(index, 1);
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

Kelebihan:

- Efisien dalam hal memori karena tidak membuat array baru.

Kekurangan:

- Kurang intuitif dan mudah dibaca dibandingkan dengan metode lain.

2. **Menggunakan `some` dan `filter`:**

```typescript
router.put("/user/:id/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendId = mongoose.Types.ObjectId(req.params.friendId);
    const isFriend = user.friends.some((id) => id.equals(friendId));

    if (isFriend) {
      user.friends = user.friends.filter((id) => !id.equals(friendId));
    } else {
      user.friends.push(friendId);
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

Kelebihan:

- Lebih mudah dibaca dan dipahami.

Kekurangan:

- Kurang efisien dalam hal memori karena membuat array baru.

3. **Menggunakan `includes` dan `pull` (hanya untuk Mongoose):**

```typescript
router.put("/user/:id/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendId = mongoose.Types.ObjectId(req.params.friendId);
    const isFriend = user.friends.includes(friendId);

    if (isFriend) {
      await User.findByIdAndUpdate(req.params.id, { $pull: { friends: friendId } });
    } else {
      await User.findByIdAndUpdate(req.params.id, { $push: { friends: friendId } });
    }

    const updatedUser = await User.findById(req.params.id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

Kelebihan:

- Lebih efisien karena langsung memperbarui database tanpa perlu menyimpan (`save`) dokumen.

Kekurangan:

- Hanya bisa digunakan dengan Mongoose dan tidak bisa digunakan dengan array biasa di JavaScript.

Pada aplikasi besar, pilihan metode tergantung pada berbagai faktor, seperti ukuran data, frekuensi operasi, dan preferensi tim pengembangan. Semoga membantu!
