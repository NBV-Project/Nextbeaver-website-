import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cookies } from "next/headers";
import { getDictionary, getLocaleFromCookies } from "@/lib/i18n";
import { getContactContent } from "@/lib/supabase/contact";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว | Nextbeaver",
  description: "นโยบายความเป็นส่วนตัวของ Nextbeaver",
  alternates: {
    canonical: "/privacy",
  },
};

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore);
  const dict = getDictionary(locale);
  const contactContent = await getContactContent();
  const updatedAt = "4 กุมภาพันธ์ 2026";

  return (
    <>
      <Header dict={dict} locale={locale} />
      <main className="min-h-screen bg-[var(--color-bg)] text-text">
        <section className="mx-auto w-full max-w-4xl px-6 pb-24 pt-32 sm:pt-36">
          <div className="border-b border-border pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Privacy Policy
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              นโยบายความเป็นส่วนตัว
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Nextbeaver ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้ เอกสารฉบับนี้จัดทำขึ้นเพื่ออธิบายแนวทาง
              การเก็บ ใช้ และคุ้มครองข้อมูลส่วนบุคคลที่เกี่ยวข้องกับการเข้าชมเว็บไซต์
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              <div>ปรับปรุงล่าสุด: <span className="text-text">{updatedAt}</span></div>
              <div>ติดต่อ: <span className="text-text">Nextbeaverstudio@gmail.com</span></div>
              <div>ผู้ดูแลข้อมูล: <span className="text-text">Nextbeaver (Freelance)</span></div>
            </div>
          </div>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted">
            <section>
              <h2 className="text-base font-semibold text-text">1. คำจำกัดความ</h2>
              <p className="mt-2">
                “ข้อมูลส่วนบุคคล” หมายถึงข้อมูลที่สามารถระบุตัวตนของบุคคลได้โดยตรงหรือโดยอ้อม
                “คุกกี้” หมายถึงไฟล์ข้อมูลขนาดเล็กที่จัดเก็บไว้ในอุปกรณ์ของผู้ใช้เพื่อจดจำการตั้งค่าและพฤติกรรมการใช้งาน
                “ผู้ควบคุมข้อมูล” หมายถึง Nextbeaver ซึ่งเป็นผู้กำหนดวัตถุประสงค์และวิธีการประมวลผลข้อมูล
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text">2. ขอบเขตของนโยบาย</h2>
              <p className="mt-2">
                นโยบายนี้ใช้กับการเข้าชมและการใช้งานเว็บไซต์ของ Nextbeaver รวมถึงข้อมูลที่ได้รับจากการโต้ตอบกับเว็บไซต์
                ทั้งทางตรงและทางอ้อม
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text">3. ประเภทข้อมูลที่เก็บรวบรวม</h2>
              <p className="mt-2">
                เราเก็บข้อมูลเชิงสถิติจากการใช้งานเว็บไซต์ เช่น หน้าที่เข้าชม ระยะเวลาการใช้งาน ประเภทอุปกรณ์
                เบราว์เซอร์ และข้อมูลทางเทคนิคที่เกี่ยวข้อง โดยข้อมูลดังกล่าวไม่มีวัตถุประสงค์เพื่อระบุตัวตนของผู้ใช้
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text">4. การเก็บข้อมูลจากแบบฟอร์มติดต่อ</h2>
              <p className="mt-2">
                เมื่อผู้ใช้ส่งข้อมูลผ่านแบบฟอร์มติดต่อ เราอาจเก็บข้อมูล เช่น ชื่อ อีเมล ชื่อบริษัท และรายละเอียดโปรเจกต์
                เพื่อนำไปใช้ในการติดต่อกลับ ให้คำปรึกษา หรือจัดทำข้อเสนอที่เกี่ยวข้อง
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text">5. วัตถุประสงค์ในการใช้ข้อมูล</h2>
              <p className="mt-2">
                ใช้เพื่อวิเคราะห์ประสิทธิภาพเว็บไซต์ ปรับปรุงประสบการณ์ผู้ใช้ และพัฒนาเนื้อหา/บริการให้สอดคล้องกับความต้องการอย่างเหมาะสม
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text">6. คุกกี้และเครื่องมือวิเคราะห์</h2>
              <p className="mt-2">
                เว็บไซต์นี้ใช้ Google Analytics 4 (GA4) เพื่อเก็บข้อมูลเชิงสถิติการใช้งาน โดยจะเริ่มเก็บข้อมูลเมื่อผู้ใช้ให้ความยินยอมเท่านั้น
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text">7. การเปิดเผยและการแบ่งปันข้อมูล</h2>
              <p className="mt-2">
                เราไม่ขายหรือเปิดเผยข้อมูลของผู้ใช้ให้บุคคลภายนอก เว้นแต่เป็นกรณีที่จำเป็นตามกฎหมาย หรือเป็นการดำเนินการ
                เพื่อให้บริการที่ผู้ใช้ร้องขอโดยชัดแจ้ง
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text">8. ระยะเวลาในการเก็บข้อมูล</h2>
              <p className="mt-2">
                เราจะเก็บรักษาข้อมูลเท่าที่จำเป็นต่อวัตถุประสงค์ในการวิเคราะห์และการปรับปรุงบริการ และจะลบหรือทำให้ข้อมูล
                ไม่สามารถระบุตัวตนได้เมื่อพ้นความจำเป็นดังกล่าว
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text">9. สิทธิของผู้ใช้</h2>
              <p className="mt-2">
                ผู้ใช้สามารถเพิกถอนความยินยอมในการใช้คุกกี้วิเคราะห์ได้ตลอดเวลา โดยปรับการตั้งค่าในแถบคุกกี้
                หรือแจ้งมายังเรา
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text">10. การเปลี่ยนแปลงนโยบาย</h2>
              <p className="mt-2">
                เราอาจปรับปรุงนโยบายฉบับนี้เป็นครั้งคราว โดยจะแสดงวันที่ปรับปรุงล่าสุดไว้บนหน้านี้
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text">11. ช่องทางติดต่อ</h2>
              <p className="mt-2">
                หากมีคำถามเกี่ยวกับนโยบายนี้ สามารถติดต่อได้ที่อีเมล Nextbeaverstudio@gmail.com
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer dict={dict} socialItems={contactContent.socialItems} />
    </>
  );
}
