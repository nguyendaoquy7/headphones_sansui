// Dữ liệu sản phẩm
const products = [
    {
        id: 1,
        name: "Sansui HD-990 Pro",
        category: "HI-FI",
        price: 2990000,
        originalPrice: 3490000,
        image: "🎧",
        rating: 4.8,
        reviews: 124,
        description: "Tai nghe Hi-Fi cao cấp với driver 50mm, âm thanh chi tiết và bass sâu",
        badge: "Bán chạy",
        detailDescription: `
            <p>Tai nghe Sansui HD-990 Pro là sự kết hợp hoàn hảo giữa công nghệ tiên tiến và thiết kế tinh tế. Với driver 50mm độc quyền, tai nghe mang đến trải nghiệm âm thanh Hi-Fi chất lượng cao với dải tần số rộng và độ chi tiết vượt trội.</p>
            
            <p>Thiết kế ergonomic với đệm tai bằng da cao cấp đảm bảo sự thoải mái trong suốt thời gian dài sử dụng. Cấu trúc chắc chắn với khung kim loại và lớp hoàn thiện cao cấp tạo nên vẻ ngoài sang trọng.</p>
            
            <p>Đặc biệt phù hợp cho việc thưởng thức nhạc, mixing và mastering chuyên nghiệp. Dây cáp có thể tháo rời giúp bảo trì dễ dàng và kéo dài tuổi thọ sản phẩm.</p>
        `,
        specifications: {
            "Driver": "50mm Dynamic",
            "Tần số": "5Hz - 40kHz",
            "Trở kháng": "32 Ohm",
            "Độ nhạy": "105dB/mW",
            "Kết nối": "3.5mm, 6.3mm adapter",
            "Trọng lượng": "350g",
            "Dây cáp": "3m có thể tháo rời",
            "Bảo hành": "2 năm"
        },
        features: [
            "Driver 50mm chất lượng cao",
            "Thiết kế mở cho âm trường rộng",
            "Đệm tai da cao cấp thoải mái",
            "Dây cáb có thể tháo rời",
            "Phù hợp cho studio và audiophile"
        ]
    },
    {
        id: 2,
        name: "Sansui Gaming X7",
        category: "GAMING",
        price: 1590000,
        originalPrice: 1890000,
        image: "🎮",
        rating: 4.6,
        reviews: 89,
        description: "Tai nghe gaming chuyên nghiệp với micro có thể tháo rời và LED RGB",
        badge: "Gaming",
        detailDescription: `
            <p>Sansui Gaming X7 được thiết kế đặc biệt cho game thủ chuyên nghiệp với âm thanh surround 7.1 ảo và micro với công nghệ khử tiếng ồn tiên tiến. Tai nghe mang đến lợi thế cạnh tranh trong các tựa game FPS và MOBA.</p>
            
            <p>Hệ thống LED RGB có thể tùy chỉnh với hơn 16 triệu màu sắc, đồng bộ với setup gaming của bạn. Thiết kế chắc chắn với khung nhôm cao cấp đảm bảo độ bền trong môi trường gaming khắc nghiệt.</p>
            
            <p>Micro có thể tháo rời với công nghệ ENC (Environmental Noise Cancellation) giúp đồng đội nghe rõ giọng nói ngay cả trong môi trường ồn ào.</p>
        `,
        specifications: {
            "Driver": "50mm Neodymium",
            "Tần số": "10Hz - 28kHz",
            "Trở kháng": "32 Ohm",
            "Độ nhạy": "110dB/mW",
            "Kết nối": "USB, 3.5mm",
            "LED": "RGB 16.7 triệu màu",
            "Micro": "Có thể tháo rời, khử tiếng ồn",
            "Trọng lượng": "380g",
            "Bảo hành": "2 năm"
        },
        features: [
            "Âm thanh surround 7.1 ảo",
            "LED RGB tùy chỉnh",
            "Micro khử tiếng ồn có thể tháo rời",
            "Đệm tai memory foam thoải mái",
            "Software tùy chỉnh âm thanh"
        ]
    },
    {
        id: 3,
        name: "Sansui Wireless Elite",
        category: "WIRELESS",
        price: 3990000,
        originalPrice: 4490000,
        image: "📱",
        rating: 4.9,
        reviews: 156,
        description: "Tai nghe không dây cao cấp với công nghệ ANC và thời lượng pin 30h",
        badge: "Mới nhất",
        detailDescription: `
            <p>Sansui Wireless Elite là đỉnh cao của công nghệ tai nghe không dây với chip Bluetooth 5.3 mới nhất, đảm bảo kết nối ổn định và chất lượng âm thanh lossless. Công nghệ ANC (Active Noise Cancellation) thông minh có thể khử tới 35dB tiếng ồn môi trường.</p>
            
            <p>Pin lithium-ion dung lượng cao cung cấp tới 30 giờ phát nhạc liên tục với ANC bật, và 40 giờ khi tắt ANC. Sạc nhanh 15 phút cho 3 giờ sử dụng. Hỗ trợ sạc không dây Qi tiện lợi.</p>
            
            <p>Driver 40mm tùy chỉnh với màng rung graphene mang đến âm thanh chi tiết với bass sâu và treble trong trẻo. Touch control thông minh cho phép điều khiển dễ dàng mà không cần lấy điện thoại ra.</p>
        `,
        specifications: {
            "Bluetooth": "5.3 với aptX HD",
            "Driver": "40mm Graphene",
            "Tần số": "8Hz - 35kHz",
            "ANC": "Hybrid, khử 35dB",
            "Pin": "30h (ANC on), 40h (ANC off)",
            "Sạc": "USB-C, Wireless Qi",
            "Trọng lượng": "290g",
            "Bảo hành": "2 năm"
        },
        features: [
            "Bluetooth 5.3 với aptX HD",
            "ANC khử tiếng ồn 35dB",
            "Pin 40 giờ sử dụng",
            "Sạc không dây Qi",
            "Touch control thông minh"
        ]
    },
    {
        id: 4,
        name: "Sansui Studio Monitor",
        category: "STUDIO",
        price: 4990000,
        originalPrice: 5990000,
        image: "🎵",
        rating: 4.7,
        reviews: 67,
        description: "Tai nghe studio monitor chuyên nghiệp cho nhà sản xuất âm nhạc",
        badge: "Pro",
        detailDescription: `
            <p>Sansui Studio Monitor được thiết kế dành riêng cho các kỹ sư âm thanh và nhà sản xuất âm nhạc chuyên nghiệp. Với độ chính xác cao và tái tạo âm thanh trung thực, tai nghe này là lựa chọn hoàn hảo cho mixing và mastering.</p>
            
            <p>Driver planar magnetic 60mm mang đến độ phân giải cực cao và dải động rộng, cho phép nghe được những chi tiết nhỏ nhất trong bản nhạc. Thiết kế mở giúp tạo ra âm trường tự nhiên và thoáng rộng.</p>
            
            <p>Khung kim loại cao cấp và đệm tai da thật đảm bảo độ bền và thoải mái trong suốt những phiên làm việc dài. Kèm theo nhiều loại dây cáp chuyên dụng cho studio.</p>
        `,
        specifications: {
            "Driver": "60mm Planar Magnetic",
            "Tần số": "10Hz - 50kHz",
            "Trở kháng": "50 Ohm",
            "Độ nhạy": "95dB/mW",
            "THD": "<0.1%",
            "Kết nối": "XLR, 6.3mm, 3.5mm",
            "Trọng lượng": "450g",
            "Bảo hành": "3 năm"
        },
        features: [
            "Driver planar magnetic 60mm",
            "Độ chính xác cao cho studio",
            "Thiết kế mở âm trường rộng",
            "Nhiều loại dây cáp kèm theo",
            "Bảo hành 3 năm"
        ]
    },
    {
        id: 5,
        name: "Sansui Sport Active",
        category: "SPORT",
        price: 990000,
        originalPrice: 1290000,
        image: "🏃",
        rating: 4.4,
        reviews: 203,
        description: "Tai nghe thể thao chống nước IPX7, phù hợp cho mọi hoạt động",
        badge: "Thể thao",
        detailDescription: `
            <p>Sansui Sport Active được thiết kế đặc biệt cho những người yêu thể thao và cuộc sống năng động. Với khả năng chống nước IPX7, tai nghe có thể chịu được mồ hôi và thậm chí có thể rửa trực tiếp dưới nước.</p>
            
            <p>Thiết kế ergonomic với móc tai silicone mềm đảm bảo tai nghe luôn ổn định ngay cả trong những hoạt động mạnh mẽ nhất. Pin lithium cung cấp 12 giờ sử dụng liên tục.</p>
            
            <p>Âm thanh được tối ưu cho thể thao với bass mạnh mẽ tạo động lực và mid-range rõ ràng để nghe nhạc và nhận cuộc gọi. Kết nối Bluetooth 5.0 ổn định trong phạm vi 10m.</p>
        `,
        specifications: {
            "Bluetooth": "5.0",
            "Driver": "10mm Dynamic",
            "Chống nước": "IPX7",
            "Pin": "12 giờ sử dụng",
            "Sạc": "USB-C nhanh",
            "Trọng lượng": "35g",
            "Màu sắc": "Đen, Xanh, Đỏ",
            "Bảo hành": "1 năm"
        },
        features: [
            "Chống nước IPX7",
            "Pin 12 giờ sử dụng",
            "Thiết kế thể thao ergonomic",
            "Bass mạnh mẽ tạo động lực",
            "Kết nối Bluetooth ổn định"
        ]
    },
    {
        id: 6,
        name: "Sansui Classic Vintage",
        category: "VINTAGE",
        price: 2490000,
        originalPrice: 2990000,
        image: "🎼",
        rating: 4.5,
        reviews: 98,
        description: "Tai nghe phong cách vintage với âm thanh ấm áp, thiết kế cổ điển",
        badge: "Vintage",
        detailDescription: `
            <p>Sansui Classic Vintage là sự kết hợp hoàn hảo giữa thiết kế cổ điển và công nghệ hiện đại. Lấy cảm hứng từ những chiếc tai nghe huyền thoại của thập niên 70-80, sản phẩm này mang đến âm thanh ấm áp và mềm mại đặc trưng.</p>
            
            <p>Vỏ gỗ tự nhiên được gia công thủ công tạo nên vẻ đẹp độc đáo cho từng chiếc tai nghe. Driver 40mm được thiết kế đặc biệt để tái tạo âm thanh vintage với mid-range ấm và bass mượt mà.</p>
            
            <p>Đệm tai bằng da cao cấp và headband có thể điều chỉnh đảm bảo sự thoải mái tối đa. Đây là lựa chọn hoàn hảo cho những ai yêu thích âm nhạc cổ điển và phong cách retro.</p>
        `,
        specifications: {
            "Driver": "40mm Dynamic",
            "Vỏ": "Gỗ tự nhiên",
            "Tần số": "15Hz - 25kHz",
            "Trở kháng": "35 Ohm",
            "Độ nhạy": "100dB/mW",
            "Kết nối": "3.5mm",
            "Trọng lượng": "320g",
            "Bảo hành": "2 năm"
        },
        features: [
            "Thiết kế vintage cổ điển",
            "Vỏ gỗ tự nhiên thủ công",
            "Âm thanh ấm áp đặc trưng",
            "Đệm tai da cao cấp",
            "Phong cách retro độc đáo"
        ]
    }
];