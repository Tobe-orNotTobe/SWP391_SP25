import React from "react"
import {Link} from "react-router-dom"
import "./Introduction.scss"

const Introduction: React.FC = () => {

    return (
        <>
            <div className="introductionContainer">
                <span>
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">Trang chủ</Link><span
                    className="separator"> » </span><span
                    className="last">Giới thiệu</span>
                </span>

                <div style={{paddingTop: "20px"}} className="introductionTitle">
                    <h1 className="gt-title">Giới thiệu</h1>
                </div>

                <p style={{textAlign: "center", paddingBottom: "10px"}}>
                    <span style={{color: "#000080", fontSize: "14pt"}}>
                        <strong>HỆ THỐNG HÀNG TRĂM TRUNG TÂM TIÊM CHỦNG SIDE_EFFECT: AN TOÀN, UY TÍN, </strong>
                    </span><br/>
                    <span style={{color: "#000080", fontSize: "14pt"}}><strong>CHẤT LƯỢNG ĐƯỢC HÀNG CHỤC TRIỆU GIA ĐÌNH TIN TƯỞNG LỰA CHỌN!</strong></span>
                </p>

                <p className="introductionText">Side_Effect là đơn vị tiên phong trong lĩnh vực tiêm chủng vắc xin dịch vụ tại Việt Nam.
                    Trải qua gần một thập kỷ phát triển, hệ thống này không ngừng mở rộng và đạt được nhiều thành tựu quan trọng trong công tác
                    tiêm chủng và phòng chống dịch bệnh, nhận được sự tin tưởng của hàng chục triệu người dân trên toàn quốc. Nhiều năm liền,
                    Side_Effect giữ vững vị trí dẫn đầu trong top 10 công ty Dược uy tín tại Việt Nam (2023, 2024) trong lĩnh vực phân phối và kinh doanh Dược phẩm,
                    trang thiết bị y tế. Ngoài ra, đơn vị còn vinh dự nhận Bằng khen của Thủ tướng Chính phủ nhờ những đóng góp xuất sắc trong công tác phòng chống dịch.
                </p>

                <p className="introductionText">Sau gần 10 năm đồng hành cùng hệ thống y học dự phòng nước nhà vượt mọi khó khăn,
                    thần tốc đẩy mạnh phát triển hệ thống đến mọi miền đất nước, đặc biệt là các địa phương vùng sâu vùng xa,
                    gia tăng cơ hội tiếp cận và tỷ lệ tiêm chủng vắc xin trong cộng đồng,
                    đến nay VNVC đã có hàng trăm trung tâm tiêm chủng trải dài trên khắp mọi miền tổ quốc,
                    nỗ lực nâng cao tỷ lệ bao phủ tiêm chủng bảo vệ sức khỏe cho trẻ em và người lớn với hơn 11 triệu liều vắc xin các loại,
                    phòng chống hơn 40 bệnh truyền nhiễm nguy hiểm.
                </p>

                <p className="introductionText">
                    Đặc biệt đáng ghi nhận là nỗ lực đẩy mạnh công tác truyền thông giáo dục cộng đồng về vai trò của tiêm chủng vắc xin với trẻ lớn,
                    người lớn, người cao tuổi, người có bệnh nền, bệnh mạn tính của hệ thống tiêm chủng VNVC. Đến nay,
                    tỷ lệ người từ 18 tuổi tiêm chủng vắc xin các loại đã đạt trên 40% tổng số khách hàng, góp phần quan trọng trong việc chăm sóc,
                    bảo vệ sức khỏe người lao động, người cao tuổi trong cộng đồng.&nbsp;
                </p>

                <p style={{textAlign: "center", paddingBottom: "10px"}}>
                    <img fetchPriority="high" decoding="async"
                        src="https://vnvc.vn/wp-content/uploads/2024/12/vnvc-co-mat-tai-55-tinh-thanh.jpg"
                         alt="vnvc có mặt tại 55 tỉnh thành"/>
                </p>


                <h2>
                    <b style={{color: "#2a388f", fontSize: "30px"}}>
                    1. Luôn có đầy đủ vắc xin chính hãng, thế hệ mới, kể cả loại thường xuyên khan hiếm cho trẻ em và
                    người lớn
                    </b>
                </h2>

                <p className="introductionText">
                    Hệ thống trung tâm tiêm tiêm chủng VNVC có hơn 50 loại vắc xin phòng hơn 40 bệnh truyền nhiễm nguy hiểm cho người lớn,
                    kể cả các loại vắc xin thế hệ mới, vắc xin thường xuyên khan hiếm trên thị trường.
                </p>

                <p className="introductionText">Với uy tín và kinh nghiệm triển khai tiêm chủng nhiều năm, VNVC đã trở thành đối tác chính thức,
                    toàn diện và chiến lược quan trọng với các hãng vắc xin lớn trên thế giới như Glaxosmithkline – Bỉ (GSK), Sanofi Pasteur (Pháp), Pfizer (Mỹ),
                    Merck Sharp and Dohme (Mỹ), AstraZeneca (Anh), Sanofi (Pháp), Abbott (Hà Lan), Takeda (Nhật Bản)… do đó, VNVC được quyền đàm phán trực tiếp,
                    nhập khẩu chính hãng tất cả các loại vắc xin dành cho trẻ em và người lớn, giúp người dân được tiếp cận đầy đủ các vắc xin thế hệ mới,
                    vắc xin khan hiếm và tiêm chủng dịch vụ an toàn, giá hợp lý, góp phần tăng cao tỷ lệ tiêm chủng, bảo vệ sức khỏe cho người lớn và tương lai
                    cho trẻ em.
                </p>

                <p className="introductionText">
                    Đặc biệt, VNVC là đơn vị tiêm chủng tại Việt Nam có các loại vắc xin thế hệ mới từ các nhà sản xuất hàng đầu thế giới như:
                    Bexsero (Ý) phòng bệnh viêm màng não, viêm phổi do não mô cầu khuẩn nhóm B, Gardasil 9 (Mỹ) phòng các bệnh ung thư cổ tử cung
                    cho nam và nữ từ 9-45 tuổi, Imojev phòng viêm não Nhật Bản, Prevenar 13 (Bỉ) phòng các bệnh do phế cầu khuẩn,
                    Menactra (Mỹ) phòng bệnh viêm màng não, viêm phổi do não mô cầu khuẩn ACYW, Boostrix (Bỉ) phòng bạch hầu – ho gà – uốn ván…
                </p>

                <figure id="attachment_77882" aria-describedby="caption-attachment-77882" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-77882"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/vnvc-luon-cung-ung-day-du-vac-xin.jpg"
                                                                alt="vnvc luôn cung ứng đầy đủ vắc xin" width="800"
                                                                height="532"/>
                    <figcaption id="caption-attachment-77882" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>VNVC cam kết cung ứng đầy đủ
                        vắc xin cho trẻ em và người lớn chất lượng cao, nhập khẩu chính hãng từ các nhà sản xuất vắc xin
                        hàng đầu Thế giới
                    </figcaption>
                </figure>
                <h2><b style={{color: "#2a388f", fontSize: "30px"}}>2. Hệ thống kho lạnh GSP, dây chuyền lạnh Cold Chain bảo quản vắc xin hiện đại và lớn nhất Việt
                    Nam</b></h2>

                <p className="introductionText">
                    VNVC tự hào là đơn vị tiêm chủng tại Việt Nam sở hữu hệ thống dây chuyền bảo quản lạnh (Cold chain) đạt tiêu chuẩn GSP,
                    hệ thống 4 kho lạnh tổng ở TP.HCM, Đà Nẵng và Hà Nội có khả năng lưu trữ và bảo quản lên đến 400 triệu liều vắc xin ở cùng một thời điểm,
                    đảm bảo nhiệt độ bảo quản từ 2-8 C theo đúng quy định nghiêm ngặt của nhà sản xuất.
                    Tất cả các trung tâm tiêm chủng VNVC đều có kho bảo quản vắc xin hoặc hệ thống dây chuyền bảo quản lạnh
                    (Cold Chain) tại chỗ, 100% phòng tiêm cho tủ bảo quản vắc xin chuyên dụng.&nbsp;
                </p>

                <p className="introductionText">Toàn bộ hệ thống kho lạnh tại VNVC được trang bị hệ thống giám sát nhiệt
                    độ tự động 24/24 tại chỗ và trực tuyến, điều khiển từ xa, phát cảnh báo qua GSM. Khi nhiệt độ ở
                    ngưỡng nguy hiểm, hệ thống cảnh báo 3 lớp gồm đèn và chuông báo sẽ lập tức kích hoạt, phát còi báo
                    động tại chỗ. Cùng lúc, hệ thống phần mềm cảnh báo sẽ gửi tin nhắn, email cảnh báo khẩn cấp đến các
                    số điện thoại, hộp thư của các nhân viên đã được cài đặt sẵn; hệ thống phát điện, cứu hoả… được kích
                    hoạt đồng thời. Nhân viên tại chỗ sẽ triển khai khẩn cấp các phương án xử lý phù hợp trong khi nhân
                    viên chi viện tới hỗ trợ theo các phân công đã được quy định.
                </p>

                <p className="introductionText">
                    Để đảm bảo vắc xin toàn trong nhiệt độ lý tưởng, tất cả các kho lạnh của VNVC đều trang bị ít nhất 2 nguồn điện
                    (nguồn điện lưới và máy phát điện dự phòng sử dụng động cơ đốt trong tại trung tâm với công suất lớn có thời gian cấp điện lên đến 72 giờ).
                    Nguồn điện dự phòng này cũng đồng thời cung cấp cho tủ đựng vắc xin chuyên dụng ở mỗi trung tâm để đảm bảo tất cả vắc xin của VNVC
                    đều được bảo quản trong điều kiện an toàn với nhiệt độ yêu cầu.
                </p>

                <p className="introductionText">
                    VNVC luôn có phương án sẵn sàng điều động xe phát điện di động có mặt trong 2 giờ đồng hồ kể từ khi yêu cầu để đảm bảo cấp điện kịp thời
                    trong trường hợp xấu nhất là cả hai nguồn điện kể trên gặp sự cố, mặc dù điều này chưa từng xảy ra. Hệ thống kiểm tra, kiểm định của VNVC
                    luôn diễn tập và chuẩn bị chu đáo cho phương án ứng phó này như “diễn tập phòng cháy chữa cháy”.
                </p>

                <p className="introductionText">
                    Ngoài ra, VNVC còn chuẩn bị phương án huy động các “kho lạnh di động” từ những trung tâm lân cận để vừa giữ vaccine an toàn,
                    vừa đưa vaccine kịp thời đến kho lạnh gần nhất trong tình huống đặc biệt nghiêm trọng để luôn đảm bảo chất lượng vaccine.
                </p>

                <figure id="attachment_78526" aria-describedby="caption-attachment-78526" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="wp-image-78526 size-full"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/kho-lanh-bao-quan-vac-xin-cua-vnvc.jpg"
                                                                alt="kho lạnh bảo quản vắc xin của vnvc" width="800"
                                                                height="534"/>
                    <figcaption id="caption-attachment-78526" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>Hệ thống kho bảo quản vắc xin
                        đạt chuẩn GSP tại VNVC, đảm bảo lưu trữ và bảo quản các loại vắc xin trong điều kiện tối ưu từ
                        2-8 độ C
                    </figcaption>
                </figure>
                <figure id="attachment_78268" aria-describedby="caption-attachment-78268" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="wp-image-78268 size-full"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/he-thong-xe-lanh-chuyen-dung-van-chuyen-vac-xin.jpg"
                                                                alt="hệ thống kho lạnh vận chuyển vắc xin" width="800"
                                                                height="534"/>
                    <figcaption id="caption-attachment-78268" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>VNVC sở hữu hệ thống hơn 30 xe
                        lạnh chuyên dụng vận chuyển vắc xin, chủ động vận chuyển và cấp phát vắc xin an toàn đến các
                        trung tâm trên toàn quốc
                    </figcaption>
                </figure>
                <figure id="attachment_77895" aria-describedby="caption-attachment-77895" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-77895"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/tu-lanh-bao-quan-vac-xin-chuyen-dung.jpg"
                                                                alt="tủ lạnh bảo quản vắc xin chuyên dụng" width="800"
                                                                height="534"/>
                    <figcaption id="caption-attachment-77895" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>100% phòng tiêm tại VNVC được
                        trang bị tủ bảo quản vắc xin chuyên dụng, vắc xin cuối ngày sẽ được hoàn về kho tổng để bảo quản
                        theo tiêu chuẩn GSP
                    </figcaption>
                </figure>

                <h2><b style={{color: "#2a388f", fontSize: "30px"}}>3. Đội ngũ bác sĩ, điều dưỡng chuyên môn cao, thực hiện quy trình tiêm chủng an toàn</b></h2>

                <p className="introductionText">
                    Hệ thống trung tâm tiêm chủng VNVC là đơn vị tiêm chủng tại Việt Nam thực hiện quy trình tiêm chủng an toàn 8 bước khép kín,
                    đảm bảo tất cả các bước thực hiện tiêm chủng được thực hiện đúng cách, được kiểm soát nghiêm ngặt nhằm đảm bảo tính an toàn ở mức tối đa.
                    Tại mỗi trung tâm VNVC đều có phòng xử trí phản ứng sau tiêm với đầy đủ trang thiết bị theo tiêu chuẩn của Bộ y tế.
                </p>

                <p className="introductionText">
                    VNVC sở hữu đội ngũ bác sĩ, điều dưỡng giỏi chuyên môn, giàu kinh nghiệm, thường xuyên được đào tạo kỹ năng chuyên môn, kỹ năng nghiệp vụ,
                    kỹ năng tiêm giảm đau, nhẹ nhàng cùng với sự chu đáo và nhiệt tình chăm sóc trẻ. 100% bác sĩ, điều dưỡng viên tại VNVC đều có chứng chỉ
                    tiêm chủng an toàn.&nbsp;
                </p>

                <p className="introductionText">
                    Điểm đặc biệt nhất của quy trình tiêm chủng tại VNVC, mỗi Khách hàng chính là một “hệ thống” quản lý chất lượng luôn giám sát các thao tác chuyên môn
                    và dịch vụ dưới sự hướng dẫn, hỗ trợ của các bác sĩ và điều dưỡng tại trung tâm, bao gồm quá trình khám sàng lọc của bác sĩ và kiểm tra,
                    thực hành tiêm chủng của điều dưỡng.
                </p>

                <p className="introductionText">
                    Tại phòng tiêm, VNVC tuân thủ đúng nguyên tắc thực hành tiêm chủng “đúng loại vắc xin – đúng đường tiêm – đúng liều lượng sử dụng”.
                    Do đó, trước khi tiến hành tiêm cho Khách hàng, điều dưỡng VNVC sẽ thực hiện quy trình đối chiếu thông tin người tiêm, công bố,
                    mời Khách hàng cùng giám sát thông tin, hạn sử dụng, tính toàn vẹn, cảm quan trên vỏ hộp, lọ vắc xin. Quá trình này có sự chứng kiến của
                    ít nhất 3 bên gồm điều dưỡng thực hiện tiêm chủng, điều dưỡng hỗ trợ tiêm chủng, Khách hàng và người nhà.
                </p>
                <p className="introductionText">
                    Sau khi tiêm, VNVC chú trọng theo dõi phản ứng sau tiêm trong ít nhất 30 phút để kịp thời xử trí trong trường hợp cần thiết.
                    Đồng thời, hướng dẫn Khách hàng tiếp tục theo dõi phản ứng tiêm chủng tại nhà trong 72 giờ tiếp theo và hỗ trợ tư vấn sức khỏe,
                    cách xử trí phản ứng sau tiêm mọi lúc mọi nơi qua hệ thống tổng đài, fanpage hoạt động 24/7 của VNVC.
                </p>

                <figure id="attachment_78525" aria-describedby="caption-attachment-78525" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-78525"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/kham-sang-loc-truoc-tiem-chung-cho-be-tai-vnvc.jpg"
                                                                alt="khám sàng lọc trước tiêm chủng cho bé tại vnvc"
                                                                width="800" height="534"/>
                    <figcaption id="caption-attachment-78525" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>Đội ngũ bác sĩ chuyên môn cao,
                        giàu kinh nghiệm tiến hành khám sàng lọc trước tiêm, tư vấn và chỉ định tiêm loại vắc xin phù
                        hợp, chính xác
                    </figcaption>
                </figure>
                <figure id="attachment_77903" aria-describedby="caption-attachment-77903" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="wp-image-77903 size-full"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/kiem-tra-thong-tin-truoc-tiem-chung.jpg"
                                                                alt="kiểm tra thông tin trước tiêm chủng" width="800"
                                                                height="534"/>
                    <figcaption id="caption-attachment-77903" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>Trước khi tiêm chủng, điều
                        dưỡng viên tại phòng tiêm sẽ tiến hành kiểm tra thông tin người được tiêm chủng, giới thiệu về
                        vắc xin để đảm bảo tính chính xác
                    </figcaption>
                </figure>
                <figure id="attachment_78527" aria-describedby="caption-attachment-78527" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-78527"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/tiem-ngua-cho-nguoi-lon-tuoi-tai-vnvc.jpg"
                                                                alt="tiêm ngừa cho người lớn tại vnvc" width="800"
                                                                height="534"/>
                    <figcaption id="caption-attachment-78527" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>Đội ngũ điều dưỡng viên tại
                        VNVC được đào tạo chuyên môn nghiệp vụ chuyên sâu, thành thạo kỹ năng tiêm giảm đau, nhẹ nhàng,
                        tạo tâm lý thoải mái cho Khách hàng
                    </figcaption>
                </figure>
                <h2><b style={{color: "#2a388f", fontSize: "30px"}}>4. Giá vắc xin ưu đãi, hợp lý, bình ổn trên toàn quốc, luôn có nhiều ưu đãi và quà tặng hấp
                    dẫn&nbsp;</b></h2>
                <p className="introductionText">
                    Sau đại dịch thế kỷ Covid-19, nền kinh tế thế giới và Việt Nam rơi vào khó khăn chung, cùng với tình trạng thường xuyên gián đoạn
                    Chương trình Tiêm chủng mở rộng khiến hàng chục triệu trẻ em trên toàn quốc không được tiêm ngừa vắc xin đầy đủ, đúng lịch,
                    đặc biệt là nhóm trẻ yếu thế, có hoàn cảnh gia đình khó khăn. Đồng thời, tỷ lệ tiêm chủng ở nhóm người trong độ tuổi lao động,
                    thanh thiếu niên, người cao tuổi nói chung trong cộng đồng chưa cao, một phần cũng do những rào cản về tài chính.
                </p>

                <p className="introductionText">
                    Trước bối cảnh đó, Hệ thống tiêm chủng VNVC nhanh chóng vận dụng năng lực đổi mới, sáng tạo, nỗ lực vượt rào cản, sáng kiến giải pháp tài chính,
                    chi trả dịch vụ tiêm vắc xin linh hoạt “Tiêm vắc xin trước, trả chi phí sau” không lãi suất, trả góp với thủ tục dễ dàng, thuận tiện,
                    kỳ hạn linh hoạt 6 hoặc 12 tháng với toàn bộ phần lãi suất được VNVC chi trả thay cho Khách hàng, nhằm hỗ trợ trẻ em và người lớn có cơ hội tiêm
                    vắc xin đầy đủ, đúng lịch, vắc xin chất lượng cao.
                </p>

                <p className="introductionText">
                    VNVC cam kết bình ổn giá, không tăng giá khi vắc xin khan hiếm. Ngoài ra, mọi khách hàng đến tiêm mũi lẻ hay trọn gói đều được miễn phí 100% dịch vụ khám
                    và tư vấn trước tiêm với bác sĩ; miễn phí wifi, gửi xe… VNVC miễn phí nhiều quà tặng giá trị như thú nhồi bông, balo chống gù, vali, mũ bảo hiểm,
                    ly cao cấp, túi bỉm sữa, túi giữ nhiệt, áo mưa…&nbsp;
                </p>

                <figure id="attachment_77907" aria-describedby="caption-attachment-77907" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="wp-image-77907 size-full"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/dong-bao-dan-toc-tiem-chung-tai-vnvc.jpg"
                                                                alt="đồng bào dân tộc tiêm chủng tại vnvc" width="800"
                                                                height="600"/>
                    <figcaption id="caption-attachment-77907" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>Trung tâm tiêm chủng VNVC nỗ
                        lực đưa vắc xin về các địa phương vùng sâu vùng xa để nhiều người dân được tiếp cận với vắc xin
                        chất lượng cao, giá bình ổn
                    </figcaption>
                </figure>

                <h2><b style={{color: "#2a388f", fontSize: "30px"}}>5. Cơ sở vật chất khang trang, hiện đại, trang thiết bị cao cấp</b></h2>
                <p className="introductionText">
                    Hàng trăm trung tâm tiêm chủng VNVC trên toàn quốc đều được trang bị cơ sở vật chất khang trang, hiện đại, phòng khám, phòng tiêm với đầy đủ các trang
                    thiết bị y tế cao cấp, đạt chuẩn Bộ Y tế. Không gian phòng chờ trước tiêm và sau tiêm thoáng mát, đầy màu sắc cuốn hút, tạo sự thân thiện với trẻ.&nbsp;
                </p>

                <p className="introductionText">
                    Ngoài ra mẹ và bé còn có khu vực riêng cho con bú, phòng thay tã, phòng pha sữa, phòng pantry… Tại khu vực sảnh chờ trước và sau tiêm,
                    VNVC cũng bố trí nước sạch, khăn giấy sạch, sạc điện thoại, wifi, giữ xe miễn phí… giúp bố mẹ có thời gian chờ đợi thoải mái hơn. Đặc biệt,
                    Khách hàng VIP khi đến tiêm tại VNVC sẽ được đón tiếp và phục vụ nhanh chóng tại khu vực “đặc quyền”, không gian riêng biệt, sang trọng, sảnh chờ rộng rãi,
                    cao cấp, tiện nghi và riêng tư.
                </p>

                <figure id="attachment_77908" aria-describedby="caption-attachment-77908" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-77908"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/khu-vuc-sanh-cho-tiem-vac-xin.jpg"
                                                                alt="khu vực sảnh chờ tiêm vắc xin" width="800"
                                                                height="534"/>
                    <figcaption id="caption-attachment-77908" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>VNVC đầu tư xây dựng không
                        gian sảnh chờ rộng rãi, thoáng mát, máy lạnh 2 chiều, hương thơm an toàn giúp Khách hàng thư
                        giãn, thoải mái trong thời gian chờ đợi
                    </figcaption>
                </figure>
                <p className="introductionText">
                    Mỗi Khách hàng khi đến tiêm chủng tại VNVC đều được cung cấp một mã số định danh (Code). Code Khách hàng này được áp dụng tại các Trung tâm tiêm
                    chủng thuộc Hệ thống tiêm chủng VNVC. Mọi thông tin cá nhân của Khách hàng được lưu giữ bảo mật và không cần khai báo lại khi đến tiêm chủng các
                    lần kế tiếp tại phòng tiêm. Khách hàng cũng có thể tự tra cứu lịch sử tiêm chủng của mình cũng như có thể đặt lịch tiêm qua website
                     <a href="https://vnvc.vn/"> vnvc.vn</a>. Đặc biệt, VNVC còn là đơn vị tiêm chủng tại Việt Nam phát triển thành công ứng dụng tiêm chủng vắc xin
                    “App VNVC”. Là trợ lý tiêm chủng toàn năng, App VNVC không chỉ cung cấp cho người dùng nhiều thông tin sức khỏe hữu ích với chất lượng nội dung
                    chuyên môn được kiểm chứng mà còn giúp người dùng tra cứu lịch sử tiêm chủng, đặt vắc xin nhanh chóng, đề xuất vắc xin theo độ tuổi,
                    ghi lại nhật ký tiêm chủng cũng như theo dõi các ưu đãi hấp dẫn tại VNVC mọi lúc mọi nơi. Với hệ thống phần mềm hiện đại và đội ngũ chăm sóc
                    Khách hàng chuyên nghiệp của VNVC, Khách hàng sẽ được nhắc lịch trước ngày tiêm tùy vào gói vắc xin mà quý Khách đã đăng ký.
                </p>

                <p className="introductionText">
                    Hướng đến sự thuận tiện, thoải mái và yên tâm cho Khách hàng, VNVC đã tăng cường giờ làm việc, tăng năng suất phục vụ Khách hàng từ 7h30 đến
                    17h tất cả các ngày từ thứ 2 đến chủ nhật, làm việc xuyên trưa không nghỉ, sẵn sàng đáp ứng nhu cầu của hàng triệu Khách hàng,
                    dù bận rộn vẫn chọn VNVC để tiêm chủng phòng bệnh.
                </p>

                <figure id="attachment_77910" aria-describedby="caption-attachment-77910" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="wp-image-77910 size-full"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/khu-vui-choi-tai-vnvc.jpg"
                                                                alt="khu vui chơi tại vnvc" width="800" height="534"/>
                    <figcaption id="caption-attachment-77910" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>Khu vực vui chơi trong trung
                        tâm rộng rãi, sạch sẽ, đồ chơi nhập khẩu cao cấp, sinh động, đảm bảo an toàn, được vệ sinh, khử
                        khuẩn nhiều lần trong ngày
                    </figcaption>
                </figure>
                <figure id="attachment_77912" aria-describedby="caption-attachment-77912" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="wp-image-77912 size-full"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/khu-vuc-thay-ta-mien-phi.jpg"
                                                                alt="khu vực thay tã miễn phí" width="800"
                                                                height="533"/>
                    <figcaption id="caption-attachment-77912" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>Hệ thống trung tâm tiêm chủng
                        VNVC miễn phí 100% bỉm tã cao cấp các loại, giúp mẹ và các bé có những trải nghiệm thoải mái như
                        tại nhà
                    </figcaption>
                </figure>
                <figure id="attachment_77913" aria-describedby="caption-attachment-77913" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="wp-image-77913 size-full"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/05/phong-theo-doi-phan-ung-sau-tiem.jpg"
                                                                alt="phòng theo dõi phản ứng sau tiêm" width="800"
                                                                height="534"/>
                    <figcaption id="caption-attachment-77913" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>100% trung tâm tiêm chủng VNVC
                        đều được trang bị phòng theo dõi phản ứng sau tiêm, xử trí tại chỗ, kịp thời và đảm bảo an toàn
                        sau tiêm cho Khách hàng
                    </figcaption>
                </figure>

                <p className="introductionText">Vừa qua, Hệ thống tiêm chủng VNVC ra mắt dịch vụ Tiêm chủng vắc xin VIP
                    với không gian riêng tư, sang trọng, đẳng cấp, tách biệt với khu vực tiêm chủng vắc xin tiêu chuẩn
                    nhằm nâng cao trải nghiệm tiêm chủng cho các khách hàng thường xuyên bận rộn hoặc có nhu cầu tiêm
                    chủng nhanh chóng, đảm bảo sự riêng tư hoặc phục vụ đặc biệt.</p>

                <p className="introductionText">Việc đưa vào hoạt động Khu Tiêm chủng VIP là minh chứng cho sự nỗ lực
                    không ngừng nghỉ của VNVC, nhằm nâng cao dịch vụ tiêm chủng an toàn chất lượng cao, từ đó đóng góp
                    quan trọng trong việc thay đổi diện mạo của ngành tiêm chủng dịch vụ mới tại Việt Nam.</p>

                <figure id="attachment_84787" aria-describedby="caption-attachment-84787" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-84787"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/08/sanh-cho-va-khu-tu-van-tiem-chung-vip.jpg"
                                                                alt="sảnh chờ và khu vực tiêm chủng vip" width="800"
                                                                height="544"/>
                    <figcaption id="caption-attachment-84787" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>VNVC ra mắt dịch vụ Tiêm chủng
                        vắc xin VIP với không gian riêng tư, sang trọng, đẳng cấp, tách biệt hoặc toàn với khu vực tiêm
                        chủng vắc xin tiêu chuẩn.
                    </figcaption>
                </figure>

                <p className="introductionText">VNVC Khu Tiêm chủng VIP được đầu tư cao cấp, sang trọng, tiện nghi hiện
                    đại, diện tích rộng lớn, đầy đủ các phòng và khu vực chức năng cao cấp. Quy trình tiêm chủng 8 bước,
                    đầu gồm đăng ký thông tin tiêm chủng; khám sàng lọc với bác sĩ; tư vấn chuyên sâu, hỗ trợ giải đáp
                    thắc mắc của người tiêm và chỉ định tiêm; thanh toán tại quầy lễ tân, nghỉ ngơi theo dõi sau tiêm;
                    tư vấn về phản ứng sau tiêm hoặc nhu cầu khác về vắc xin ngay tại chỗ hoặc qua tổng đài.</p>

                <figure id="attachment_84786" aria-describedby="caption-attachment-84786" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-84786"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/08/khu-vuc-kham-tiem-tai-tiem-chung-vip.jpg"
                                                                alt="khu vực khám và tiêm tại tiêm chủng vip"
                                                                width="800" height="544"/>
                    <figcaption id="caption-attachment-84786" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>Khu tiêm chủng VIP VNVC giới
                        hạn số lượng Khách hàng mỗi ngày nhằm đảm bảo chất lượng phục vụ, không gian riêng tư và rút
                        ngắn thời gian chờ đợi.
                    </figcaption>
                </figure>

                <p className="introductionText">VNVC tiêm chủng VIP được thiết kế từng khu vực chức năng riêng biệt nhằm
                    tăng tính thuận tiện, hạn chế di chuyển. Cơ sở vật chất, bàn ghế, vật dụng phục vụ khách hàng sử
                    dụng loại cao cấp so với khu tiêm tiêu chuẩn, tăng cảm giác thoải mái. Đặc biệt, giá vắc xin khi sử
                    dụng dịch vụ Tiêm chủng VIP vẫn được giữ nguyên theo bảng giá niêm yết của VNVC trên toàn hệ thống.
                    Khách hàng có thể đặt lịch tiêm chủng nhanh chóng, thuận tiện qua tổng đài, fanpage VNVC hoặc đăng
                    ký trực tiếp tại khu vực Tiêm chủng VIP của VNVC…</p>

                <figure id="attachment_84788" aria-describedby="caption-attachment-84788" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-84788"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/08/tien-ich-cao-cap-tai-tiem-chung-vip.jpg"
                                                                alt="tiện ích cao cấp tại tiêm chủng vip" width="800"
                                                                height="543"/>
                    <figcaption id="caption-attachment-84788" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>Khu tiêm chủng VIP được đầu tư
                        cơ sở vật chất hiện đại, dịch vụ chăm sóc Khách hàng đạt chuẩn Quốc tế. Trẻ em được đầu tư riêng
                        khu vui chơi hiện đại, trang bị nhiều đồ chơi kích thích sự sáng tạo theo phương pháp giáo dục
                        Montessori.
                    </figcaption>
                </figure>

                <p className="introductionText">Khách hàng tiêm chủng VIP được điều dưỡng theo dõi, kiểm tra sau tiêm 30
                    phút ngay tại chỗ ngồi, không cần phải di chuyển, đồng thời được hướng dẫn theo dõi các phản ứng sau
                    tiêm tại nhà và cách chăm sóc, dinh dưỡng sau tiêm chủng. Đặc biệt, tất cả Khách hàng VIP từ 7 tuổi
                    được hướng dẫn sử dụng dịch vụ phân tích thành phần cơ thể với máy InBody 770 thế hệ mới nhất (tại
                    VNVC Hoàng Văn Thụ), có khả năng phân tích chuyên sâu hơn 50 chỉ số quan trọng của cơ thể từ đó bác
                    sĩ sẽ tư vấn điều chỉnh chế độ ăn uống, vận động phù hợp hoặc đưa ra các phác đồ điều trị dinh
                    dưỡng, vận động tối ưu nhất.</p>

                <p style={{textAlign: "center", paddingBottom: "10px"}}><img decoding="async" className="aligncenter size-full wp-image-84784"
                                                     src="https://vnvc.vn/wp-content/uploads/2024/08/cho-tiem-vac-xin-tai-tiem-chung-vip.jpg"
                                                     alt="chờ tiêm vắc xin tại tiêm chủng vip" width="800"
                                                     height="534"/></p>
                <figure id="attachment_84785" aria-describedby="caption-attachment-84785" style={{width: "800px", margin:"0 auto", textAlign:"center", paddingBottom: "10px"}}
                        className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-84785"
                                                                src="https://vnvc.vn/wp-content/uploads/2024/08/do-chieu-cao-can-nang.jpg"
                                                                alt="đo chiều cao cân nặng" width="800" height="534"/>
                    <figcaption id="caption-attachment-84785" className="wp-caption-text" style={{fontStyle: "italic", fontSize: "17px"}}>Khách hàng muốn sử dụng dịch
                        vụ Tiêm chủng VIP tại VNVC có thể đặt hẹn qua tổng đài, website, app VNVC hoặc đăng ký trực tiếp
                        tại trung tâm tiêm chủng.
                    </figcaption>
                </figure>

            </div>
        </>

    );

}

export default Introduction