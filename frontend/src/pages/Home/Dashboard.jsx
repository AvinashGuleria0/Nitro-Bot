import React, { useState, useEffect } from "react";
import { LuPlus, LuSparkles } from "react-icons/lu";
import Card_BG from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axioInstance from "../../utils/axioInstance";
import SummaryCard from "../../components/cards/SummaryCard";
import moment from "moment";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    try {
      const response = await axioInstance.get(API_PATHS.SESSION.GET_ALL);
      console.log("API response:", response);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      const res = await axioInstance.delete(
        API_PATHS.SESSION.DELETE(sessionData._id)
      );

      setSessions((prev) => prev.filter((s) => s._id !== sessionData._id));
      setOpenDeleteAlert({ open: false, data: null });

      toast.success("Session deleted successfully");
    } catch (error) {
      toast.error("Failed to delete session");
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden">
        <div className="container mx-auto pt-8 pb-24 relative z-10 px-6">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[var(--color-accent-pink)] sketch-border flex items-center justify-center -rotate-3">
                <LuSparkles className="text-black text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-black tracking-tight inline-block bg-white px-4 py-1 sketch-border shadow-[2px_2px_0px_0px_#000]">
                  Interview Prep Dashboard
                </h1>
                <p className="text-slate-800 font-bold mt-2 text-lg">
                  {sessions.length > 0
                    ? `Manage your ${
                        sessions.length
                      } interview preparation session${
                        sessions.length !== 1 ? "s" : ""
                      }`
                    : "Start your interview preparation journey"}
                </p>
              </div>
            </div>
          </div>

          {/* Sessions Grid */}
          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sessions?.map((data, index) => (
                <div
                  key={data?.id || data?._id || index}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <SummaryCard
                    colors={Card_BG[index % Card_BG.length]}
                    role={data?.role || ""}
                    topicsToFocus={data?.topicsToFocus || ""}
                    experience={data?.experience || ""}
                    questions={data?.questions?.length || ""}
                    description={data?.description || ""}
                    lastUpdated={
                      data?.updatedAt
                        ? moment(data.updatedAt).format("Do MMM YYYY")
                        : ""
                    }
                    onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                    onDelete={() => setOpenDeleteAlert({ open: true, data })}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-32 h-32 bg-[var(--color-accent-blue)] sketch-border flex items-center justify-center mb-8 rotate-3 sketch-shadow">
                <LuSparkles className="text-black text-4xl" />
              </div>
              <h3 className="text-3xl font-black text-black mb-3">
                No Sessions Yet
              </h3>
              <p className="text-slate-800 font-bold text-center max-w-md mb-8 leading-relaxed">
                Create your first interview preparation session to get started
                with AI-powered learning and practice.
              </p>
              <button
                className="sketch-button bg-[var(--color-accent-pink)] text-black font-black px-8 py-4 flex items-center gap-2"
                onClick={() => setOpenCreateModal(true)}
              >
                <LuPlus className="text-lg" />
                Create First Session
              </button>
            </div>
          )}


          {/* Extended FAB for larger screens */}
          {sessions.length > 0 && (
            <button
              className="hidden lg:flex fixed bottom-8 right-8 h-14 items-center justify-center gap-3 bg-[var(--color-accent-yellow)] text-black font-black px-6 py-4 sketch-button z-20"
              onClick={() => setOpenCreateModal(true)}
            >
              <LuPlus className="text-lg" />
              <span>New Session</span>
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <div>
          <CreateSessionForm />
        </div>
      </Modal>

      {openDeleteAlert.open && (
        <Modal
          isOpen={openDeleteAlert?.open}
          onClose={() => {
            setOpenDeleteAlert({ open: false, data: null });
          }}
          title="Delete Session"
        >
          <div className="w-full">
            <DeleteAlertContent
              content="Are you sure you want to delete this session? This action cannot be undone."
              onDelete={() => deleteSession(openDeleteAlert.data)}
            />
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
